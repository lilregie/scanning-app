/// <reference types="@sveltejs/kit" />

declare module '*.svg' {
	import { SvelteComponent } from 'svelte'
	const content: SvelteComponent
	export default content
}

declare module '*.svg?component' {
	import { SvelteComponent } from 'svelte'
	const content: SvelteComponent
	export default content
}

declare module '*.svg?src' {
	const content: string
	export default content
}

declare module '*.svg?url' {
	const content: string
	export default content
}

declare module 'normalize-strings' {
	export default function normalizeStrings(str: string): string
}
