import { verifyPassURI } from "@vaxxnz/nzcp/dist/esbuild/browser";
import { get } from "svelte/store";
import { eventAttendees } from "./store";
import { normString as norm } from "$lib/utill";

import type { Attendee } from "./attendee";
import type { VerificationResult } from "@vaxxnz/nzcp";


declare type ScanResults = {
    valid: true;
    attendee: Attendee;
    covidPassInfo?: VerificationResult;
} | {
    valid: false;
}

export async function validateScan(scanText: string): Promise<ScanResults> {
    if (scanText.startsWith("NZCP:")) {
        // NZ Covid Pass
        const passResult = await verifyPassURI(scanText)
        if (passResult.success) {
            console.log(passResult)
            const relevantPerson = searchPerson(passResult.credentialSubject.givenName, passResult.credentialSubject.givenName)
            if (relevantPerson !== null) {
                return {
                    valid: true,
                    attendee: relevantPerson,
                    covidPassInfo: passResult
                }
            } else {
                return {
                    valid: false
                }
            }
        }
    }
    return {
        valid: false
    }
}

function searchPerson(firstName: string, lastName: string) {
    const attendees = get(eventAttendees);
    const matches = attendees.filter((possibleMatch) =>
        norm(possibleMatch.first_name) === norm(firstName) && norm(possibleMatch.last_name) === norm(lastName)
    )
    return matches.length === 1 ? matches[0] : null
}