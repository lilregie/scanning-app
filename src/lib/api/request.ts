// Custom fetch wrapper to deal with all the fun stuff with CSRF tokens and routes

import { basePath } from "$lib/consts";
import { apiProduction, csrfAPIState } from "./statusStores";
import { get as storeGet } from "svelte/store";
import { v4 } from "uuid";
import { apiTimers } from "./statusStores";
import { mergeDeep } from "$lib/utill";

async function process(options: FullRequestOptions): Promise<Response> {
	const { route, method, body, customParams, headers } = options;

	const origin = storeGet(apiProduction) ? "" : "http://localhost:8080";

	let URL = `${origin}${basePath}${route}`

	// In production, sometimes the api url is /x/y.json, and the base path is /x/y
	// To simulate in testing, we need to request .json, but that means the url
	// is now relative, which is shouldn't be.

	// ^ If not relative
	if (`${basePath}${route}`[0] !== "/") {
		// Make relative
		URL = `${origin}${basePath}/${route}`;
		console.log("yes", URL)
	}

	const requestID = v4();

	// apiTimers keeps track of all the requests that are currently running,
	// so that we can show the user if the request is taking too long
	apiTimers.update((_apiTimers) => {
		_apiTimers.set(requestID, new Date().getTime());
		return _apiTimers;
	})

	let result = null;

	const merged_headers = headers || new Headers();
	merged_headers.set("X-CSRF-Token", storeGet(csrfAPIState) || "");
	merged_headers.set("X-Request-ID", requestID);
	merged_headers.set("Accept", "application/json");

	if (body && !merged_headers.has("Content-Type")) {
		merged_headers.set("Content-Type", "application/json");
	}
	console.log((typeof body === "string" ? body : JSON.stringify(body)))
	const params: RequestInit = mergeDeep(
		{
			method,
			body: (typeof body==="string" ? body : JSON.stringify(body)) || null,
			headers: merged_headers
		} as RequestInit,
		customParams
	);
	console.log(customParams,params)

	try {
		result = await fetch(
			URL,
			params
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

interface RequestOptions {
	route: string;
	customParams?: RequestInit;
	headers?: Headers;
}
interface RequestOptionsWithBody extends RequestOptions {
	body?: string | object;
}

interface FullRequestOptions extends RequestOptionsWithBody {
	method: "GET" | "POST" | "PUT" | "DELETE";
}

export const request = {
	get: (options: RequestOptions) => {
		return process({...options, method: "GET"});
	},

	post: (options: RequestOptionsWithBody) => {
		return process({...options, method: "POST"});
	},

	put: (options: RequestOptionsWithBody) => {
		return process({...options, method: "PUT"});
	},

	// delete is a reserved word
	delete_: (options: RequestOptionsWithBody) => {
		return process({...options, method: "DELETE"});
	}
}
