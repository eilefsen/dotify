import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function secondsToMinutesSeconds(d: number) {
    var m = Math.floor(d / 60);
    var s = Math.floor(d % 60);

    var mDisplay = m;
    var sDisplay = String(s).padStart(2, "0");
    return mDisplay + ":" + sDisplay;
}
