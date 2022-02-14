// Custom fetch wrapper to deal with all the fun stuff with CSRF tokens and routes

import { basePath } from "$lib/consts";
import { apiProduction, csrfAPIState } from "./statusStores";
import { get as storeGet } from "svelte/store";
import { v4 } from "uuid";
import { apiTimers } from "./statusStores";

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

	async function process(input: string, data: any | null, params: RequestInit = {}, method: "GET" | "POST" | "PUT" | "DELETE"): Promise<Response> {

		const origin = storeGet(apiProduction) ? "" : "http://localhost:8080";

		let URL = `${origin}${basePath}${input}`

		// In production, sometimes the api url is /x/y.json, and the base path is /x/y
		// To simulate in testing, we need to request .json, but that means the url
		// is now relative, which is shouldn't be.

		// ^ If not relative
		if (`${basePath}${input}`[0] !== "/") {
			// Make relative
			URL = `${origin}${basePath}/${input}`;
			console.log("yes",URL)
		}

		let requestID = v4();

		// apiTimers keeps track of all the requests that are currently running,
		// so that we can show the user if the request is taking too long
		apiTimers.update(_apiTimers => {
			_apiTimers.set(requestID, new Date().getTime());
			return _apiTimers;
		})

		let result = null;

		try {
			result = await fetch(
				URL,
				{
					method,
					body: data && JSON.stringify(data) || null,
					...params,
					headers: { "x-csrf-token": storeGet(csrfAPIState) || "" }
				}
			);
			console.log("Received header", result.headers.get("x-csrf-token"))
			csrfAPIState.set(result.headers.get("x-csrf-token"));

		} finally {
			// Clear API request from logs
			apiTimers.update(_apiTimers => {
				_apiTimers.delete(requestID);
				return _apiTimers;
			})
		}

		return result
	}
}
