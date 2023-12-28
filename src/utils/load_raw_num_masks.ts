import NumMask from "../types/num_mask";
import {RawNumMasksSet} from "../types/raw_num_mask";

export default function load_raw_num_masks(raw_num_masks_sets: Array<RawNumMasksSet>): Array<NumMask> {
    return raw_num_masks_sets.map(rawNumMasksSet =>
        rawNumMasksSet.map((rawNumMask, rawNumMaskIndex) =>
            NumMask.from_raw_num_mask(rawNumMask, rawNumMaskIndex))
    ).flat();
}