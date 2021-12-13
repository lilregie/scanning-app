import { verifyPassURI } from "@vaxxnz/nzcp";

import type { VerificationResult } from "@vaxxnz/nzcp";


declare type ScanResults = {
    valid: true;
    givenName: string,
    lastName: string,
    DOB: string,
    covidPassInfo: VerificationResult;
} | {
    valid: false;
    violates: string;
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
            
        } else {
            console.log("NZCP",passResult)
            return {
                valid: false,
                violates: passResult.violates.description
            }
        }
    }
    return {
        valid: false,
        violates: "Not an NZ Covid Pass"
    }
}