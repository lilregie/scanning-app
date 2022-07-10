import { verifyPassURIOffline } from "@vaxxnz/nzcp";

import type { VerificationResult } from "@vaxxnz/nzcp";
import type { Attendee, EventletAttendance } from "../../attendee";
import type { Eventlet } from "../../event";
import { allEventAttendees } from "../../store";
import { get } from "svelte/store";

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
    id: number;
    attendee: Attendee;
    eventletID: number;
}

export enum ScanTypes {
    TicketBarcode = "ticket-barcode",
    CovidPass = "covid-pass"
}

export async function validateScan(scanText: string, enabledScanTypes: ScanTypes[]): Promise<ScanResults | ScanError> {
    if (scanText.startsWith("NZCP:")) {
        console.log(enabledScanTypes)
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
                violation: passResult.violates.description
            }
        }
    }
    if (!isNaN(parseInt(scanText))) {
        if (!enabledScanTypes.includes(ScanTypes.TicketBarcode)) {
            return {
                valid: false,
                violation: "Ticket scanning is not enabled"
            }
        }
        // Ticket Barcode

        // Search for booking
        let ticketID = parseInt(scanText);
        let ticketInfo = getBookingFromTicket(ticketID);
        if (ticketInfo) {
            let [attendee, eventletID] = ticketInfo;

            return {
                valid: true,
                data: {
                    type: ScanTypes.TicketBarcode,
                    id: ticketID,
                    attendee,
                    eventletID
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

    let violation = `Scan text doesn't match any known format. Looking for ${lookingFor}`;
    return {
        valid: false,
        violation
    }
}

function getBookingFromTicket(ticketID: number): [Attendee, number] | null {
    let attendeeMatch: [Attendee, number] = null;
    for (let attendee of get(allEventAttendees)) {
        let eventletMatches = attendee.attendances.filter(booking => booking.ticket_number === ticketID);
        if (eventletMatches.length > 0) {
            attendeeMatch = [attendee, eventletMatches[0].eventlet_id];
            break;
        }
    }
    return attendeeMatch;
}

