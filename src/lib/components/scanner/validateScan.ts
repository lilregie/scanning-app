import type { VerificationResult } from "@vaxxnz/nzcp";
import type { Attendee } from "../../attendee";
import { allEventAttendees } from "$lib/store";
import { get } from "svelte/store";

import { validate as uuidValidate } from "uuid";

export interface ScanSuccess {
	valid: true;
	data: Ticket;
}
export interface ScanError {
	valid: false;
	data?: string,
	violation: string;
}

export type ScanResult = ScanSuccess | ScanError

export interface NZCovidPass {
	type: ScanTypes.CovidPass;
	givenName: string;
	lastName: string,
	DOB: string,
	covidPassInfo: VerificationResult;
};

export interface Ticket {
	type: ScanTypes.TicketBarcode;
	key: string;
	attendee?: Attendee | null;
}

export enum ScanTypes {
	TicketBarcode = "ticket-barcode",
	CovidPass = "covid-pass"
}

export function validateScan(scanText: string): ScanSuccess | ScanError {
	const ticketKey = scanText.trim();

	if (!uuidValidate(ticketKey)) {
		const violation = `QR code invalid. Please scan a valid Lil Regie ticket.`;

		return {
			valid: false,
			violation
		}
	}

	// Search for booking
	const attendee = getBookingFromTicket(ticketKey);
	// if (attendee) {
		return {
			valid: true,
			data: {
				type: ScanTypes.TicketBarcode,
				key: ticketKey,
				attendee
			}
		}
	// } else {
	// 	return {
	// 		valid: false,
	// 		violation: "Ticket not found"
	// 	}
	// }
}

function getBookingFromTicket(ticketKey: string): Attendee | null {
	const eventAttendees = get(allEventAttendees);

	if (!eventAttendees) {
		console.info("Trying to retrieve booking from ticket, but no event attendees are loaded");
		return null;
	}

	return eventAttendees.find((attendee) => (attendee.ticket_uuid === ticketKey)) || null;
}

