// Custom fetch wrapper to deal with all the fun stuff with CSRF tokens and routes

import { basePath } from "$lib/consts";
import { apiProduction, csrfAPIState } from "$lib/store";
import { get as storeGet } from "svelte/store";

export namespace request {
    export function get(input: string, params: RequestInit = {}) {
        return process(input, null, params, "GET");
    }
    export function post(input: string, data: any, params: RequestInit = {}) {
        return process(input, data, params, "POST");
    }
    export function put(input: string, data: any, params: RequestInit = {}) {
        return process(input, data, params, "PUT");
    }

    // delete is a reserved word
    export function delete_(input: string, data: any, params: RequestInit = {}) {
        return process(input, data, params, "DELETE");
    }

    async function process(input: string, data: any | null, params: RequestInit = {}, method: "GET"|"POST"|"PUT"|"DELETE"): Promise<Response> {
        const origin = storeGet(apiProduction) ? "" : "http://localhost:8080";; 
        input = `${origin}${basePath}${input}`
        const result = await fetch(
            input,
            {
                method,
                body: data && JSON.stringify(data) || null,
                ...params,
                headers: {"X-CSRF-Token": storeGet(csrfAPIState) || ""}
            }
        );
        csrfAPIState.set(result.headers.get("X-CSRF-Token"));
        return result
    }
}