import {RawNumMask} from "./raw_num_mask";

export type Point = {
    x: number, y: number;
}

export default class NumMask {
    constructor(
        readonly height: number,
        readonly width: number,
        readonly points: Array<Point>,
        readonly digit: number
    ) { }

    public static from_raw_num_mask(raw_num_mask: RawNumMask, digit: number) {
        const height = raw_num_mask.length;
        const width = raw_num_mask[0].length;

        let points = new Array<Point>();
        raw_num_mask.forEach((raw_num_mask_line, y) => {
            Array.from(raw_num_mask_line).map((filledState, x) => {
                if (filledState == '1') points.push({x, y: height - y - 1});
            });
        });

        return new NumMask(height, width, points, digit);
    }
}