// Declaration types for Hooks
// * declarations that are not exported are for internal use

import type { MaybePromise } from "@sveltejs/kit/types/private";

// type of string[] is only for set-cookie
// everything else must be a type of string
type ResponseHeaders = Record<string, string | string[]>;

export interface RequestEvent<Locals = Record<string, any>> {
	request: Request;
	url: URL;
	params: Record<string, string>;
	locals: Locals;
}

export interface ResolveOpts {
	ssr?: boolean;
}

export interface Handle<Locals = Record<string, any>> {
	(input: {
		event: RequestEvent<Locals>;
		resolve(event: RequestEvent<Locals>, opts?: ResolveOpts): MaybePromise<Response>;
	}): MaybePromise<Response>;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }: { event: RequestEvent; resolve(event: RequestEvent, opts?: ResolveOpts): MaybePromise<Response> }) {
	const response = await resolve(event, {
		ssr: false
	});

	return response;
}
