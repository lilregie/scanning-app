import { writable } from 'svelte/store';
import type {Writable} from 'svelte/store';


/** Makes a store persistent in local storage
 * @param  {[Writable]} store Writable store to be made persistent
 * @param  {[string]} key Key to be used in Local Storage
 */
function useLocalStorage<T>(store: Writable<T>, key: string) {
    if (typeof localStorage!=="undefined") {
        const json = localStorage.getItem(key);
        if (json) {
            store.set(JSON.parse(json));
        }
    
        store.subscribe(current => {
            localStorage.setItem(key, JSON.stringify(current));
        });
    }

}

export const chosenProject = writable("");
useLocalStorage(chosenProject,"chosenProject")


