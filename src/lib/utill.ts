export function eventNameFromReference(reference: string): string {
	return reference.split(' ').slice(1).join(' ');
}
