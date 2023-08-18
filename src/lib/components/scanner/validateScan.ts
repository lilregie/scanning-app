import { verifyPassURIOffline } from "@vaxxnz/nzcp";

import type { VerificationResult } from "@vaxxnz/nzcp";
import type { Attendee } from "../../attendee";
import { allEventAttendees } from "../../store";
import { get } from "svelte/store";

import { validate as uuidValidate } from "uuid";

export interface ScanResults {
	valid: true;
	data: NZCovidPass | Ticket;
}
export interface ScanError {
	valid: false;
	violation: string;
}

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
	attendee: Attendee;
}

export enum ScanTypes {
	TicketBarcode = "ticket-barcode",
	CovidPass = "covid-pass"
}

export async function validateScan(scanText: string, enabledScanTypes: ScanTypes[]): Promise<ScanResults | ScanError> {
	if (scanText.startsWith("NZCP:")) {
		if (!enabledScanTypes.includes(ScanTypes.CovidPass)) {
			return {
				valid: false,
				violation: "Covid Pass scanning is not enabled"
			}
		}

		// NZ Covid Pass
		const passResult = verifyPassURIOffline(scanText)

		if (passResult.success) {
			// const relevantPerson = searchPerson()
			return {
				valid: true,
				data: {
					type: ScanTypes.CovidPass,
					givenName: passResult.credentialSubject.givenName,
					lastName: passResult.credentialSubject.familyName,
					DOB: passResult.credentialSubject.dob,
					covidPassInfo: passResult
				}
			}

		} else {
			return {
				valid: false,
				violation: passResult.violates.description || "Unknown error"
			}
		}
	}

	if (uuidValidate(scanText)) {
		if (!enabledScanTypes.includes(ScanTypes.TicketBarcode)) {
			return {
				valid: false,
				violation: "Ticket scanning is not enabled"
			}
		}
		// Ticket Barcode

		// Search for booking
		const ticketKey = scanText.trim();
		const attendee = getBookingFromTicket(ticketKey);
		if (attendee) {

			return {
				valid: true,
				data: {
					type: ScanTypes.TicketBarcode,
					key: ticketKey,
					attendee
				}
			}
		} else {
			return {
				valid: false,
				violation: "Ticket not found"
			}
		}
	}
	// Doesn't match any known format
	let lookingFor = "";
	if (enabledScanTypes.includes(ScanTypes.CovidPass) && enabledScanTypes.includes(ScanTypes.TicketBarcode)) {
		lookingFor = "Covid Pass or Ticket";
	} else if (enabledScanTypes.includes(ScanTypes.CovidPass)) {
		lookingFor = "Covid Pass";
	} else if (enabledScanTypes.includes(ScanTypes.TicketBarcode)) {
		lookingFor = "Ticket";
	} else {
		lookingFor = "nothing (something went wrong)";
	}

	const violation = `Scan text doesn't match any known format. Looking for ${lookingFor}`;

	return {
		valid: false,
		violation
	}
}

function getBookingFromTicket(ticketKey: string): Attendee | null {
	const eventAttendees = get(allEventAttendees);

	if (!eventAttendees) {
		console.error("Trying to retrieve booking from ticket, but no event attendees are loaded");
		return null;
	}
	return eventAttendees.find((attendee) => (attendee.ticket_uuid === ticketKey)) || null;
}

