import {Color} from "./color";
import NumMask from "./num_mask";

export default class MonochromePicture {
    constructor (
        readonly height: number,
        readonly width: number,
        readonly filled: Array<Array<boolean>>,
    ) {}

    public has_digit (x: number, y: number, digit_num_mask: NumMask): boolean {
        if (y + digit_num_mask.height > this.height || x + digit_num_mask.width > this.width) return false;
        return digit_num_mask.points.every(filled_point => this.filled[y + filled_point.y][x + filled_point.x]);
    }

    public get_digit (x: number, y: number, digits_num_masks: Array<NumMask>): NumMask | undefined {
        return digits_num_masks.find(num_mask => this.has_digit(x, y, num_mask));
    }

    public static from_img (
        img: HTMLImageElement,
        font_color: Color
    ): MonochromePicture | undefined {
        const ctx = document.createElement("canvas").getContext("2d");

        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const img_data = ctx.getImageData(0, 0, img.width, img.height).data;

        const picture = new Array<Array<boolean>>(img.height);
        for (let pixelIndex = 0; pixelIndex < img.width * img.height; pixelIndex++) {
            const x = pixelIndex % img.width,
                y = img.height - Math.floor(pixelIndex / img.width) - 1;

            const color: Color = {
                red: img_data[pixelIndex * 4],
                green: img_data[pixelIndex * 4 + 1],
                blue: img_data[pixelIndex * 4 + 2]
            };

            if (!picture[y]) picture[y] = new Array<boolean>(img.width);

            picture[y][x] = (color.red == font_color.red && color.green == color.green && color.blue == font_color.blue);
        }

        return new MonochromePicture(img.height, img.width, picture);
    }

    public static from_png (data: ArrayBuffer) {
        // http://www.libpng.org/pub/png/spec/1.2/PNG-Rationale.html#R.PNG-file-signature
        const PNG_SIGNATURE_LENGTH = 8;

        // skip png signature
        const data_view = new DataView(data, PNG_SIGNATURE_LENGTH);

        // https://notabug.org/amg/scole/src/master/api/captchaGen.js#L38-L48
        // some offsets hardcoded in server
        const CHUNK_DATA_OFFSET = 8,
            IHDR_CHUNK_POSITION = 0,
            IMAGE_WIDTH_POSITION = IHDR_CHUNK_POSITION + CHUNK_DATA_OFFSET,
            IMAGE_HEIGHT_POSITION = IHDR_CHUNK_POSITION + 12,
            IDAT_CHUNK_POSITION = 81,
            IDAT_DATA_POSITION = IDAT_CHUNK_POSITION + CHUNK_DATA_OFFSET;

        // get width and height from IHDR chunk
        const width = data_view.getUint32(IMAGE_WIDTH_POSITION),
            height = data_view.getUint32(IMAGE_HEIGHT_POSITION);

        const picture = new Array<Array<boolean>>(height);
        for (let y = 0; y < height; y++) picture[y] = new Array<boolean>(width);

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // https://notabug.org/amg/scole/src/master/api/captchaGen.js#L95
                // way to calculate byte where pixel is stored
                const i = y * (width + 1) + x + 1,
                    buffer_position = IDAT_DATA_POSITION + 2 + 5 * Math.floor((i / 0xffff) + 1) + i;

                // https://notabug.org/amg/scole/src/master/api/captchaGen.js
                // if pixel is filled its byte is 1
                picture[height - y - 1][x] = data_view.getUint8(buffer_position) == 1;
            }
        }

        return new MonochromePicture(height, width, picture);
    }
};