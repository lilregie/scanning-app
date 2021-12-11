import { verifyPassURI } from "@vaxxnz/nzcp";
import { get } from "svelte/store";
import { eventAttendees } from "./store";
import { normString as norm } from "$lib/utill";

import type { Attendee } from "./attendee";
import type { VerificationResult } from "@vaxxnz/nzcp";


declare type ScanResults = {
    valid: true;
    givenName: string,
    lastName: string,
    DOB: string,
    covidPassInfo?: VerificationResult;
} | {
    valid: false;
}

export interface ScanTypes {
    ticketBarcode: boolean;
    nzCovidPass: boolean;
}

export async function validateScan(scanText: string, enabledScanTypes: ScanTypes): Promise<ScanResults> {
    if (scanText.startsWith("NZCP:") && enabledScanTypes.nzCovidPass) {
        // NZ Covid Pass
        const passResult = await verifyPassURI(scanText)
        console.log("NZCP",passResult)

        if (passResult.success) {
            // const relevantPerson = searchPerson()
            return {
                valid: true,
                givenName: passResult.credentialSubject.givenName,
                lastName: passResult.credentialSubject.familyName,
                DOB: passResult.credentialSubject.dob,
                covidPassInfo: passResult
            }
            
        }
    }
    return {
        valid: false
    }
}

// function searchPerson(firstName: string, lastName: string) {
//     const attendees = get(eventAttendees);
//     const matches = attendees.filter((possibleMatch) =>
//         norm(possibleMatch.first_name) === norm(firstName) && norm(possibleMatch.last_name) === norm(lastName)
//     )
//     return matches.length === 1 ? matches[0] : null
// }