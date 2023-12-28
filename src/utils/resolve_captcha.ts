import NumMask from "../types/num_mask";
import MonochromePicture from "../types/monochrome_picture";

export default function resolve_captcha (
    monochrome_picture: MonochromePicture,
    digits_num_masks: Array<NumMask>
): string {
    let parsed_digits = "";
    for (let x = 0; x < monochrome_picture.width; x++) {
        for (let y = 0; y < monochrome_picture.height; y++) {
            const parsed_digit = monochrome_picture.get_digit(x, y, digits_num_masks);

            if (typeof parsed_digit != "undefined") {
                parsed_digits += parsed_digit.digit;
                x += parsed_digit.width;
            }
        }
    }

    return parsed_digits;
}