import { writable } from "svelte/store";
import type { Writable } from 'svelte/store';


export const errorAPICallbacks: Writable<(() => void)[]> = writable([]);
export const apiTimers: Writable<Map<string,number>> = writable(new Map());