import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
export function sleep(delay: number) {
	return new Promise(function (resolve) {
		setTimeout(resolve, delay);
	});
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
