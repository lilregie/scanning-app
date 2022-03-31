import type { Attendee } from "$lib/attendee";
import { currentEvent } from "$lib/store";
import type { SvelteComponent } from "svelte";
import { get } from "svelte/store";
import type { NZCovidPass } from "../scanner/validateScan";

// Steps
import ScanVaccinePassSvelte from "./steps/ScanVaccinePass.svelte";
import ScanBarcodeTicketSvelte from "./steps/ScanBarcodeTicket.svelte";
import AttendeeMatchingSvelte from "./steps/AttendeeMatching.svelte";
import SelectEventletsSvelte from "./steps/SelectEventlets.svelte";

export enum Steps {
    ScanVaccinePass = "Scan Vaccine Pass",
    ScanTicket = "Scan Ticket",
    ConfirmEventlets = "Confirm Eventlets",
    AttendeeMatching = "Attendee Matching",
}

export const StepComponents = {
    [Steps.ScanVaccinePass]: ScanVaccinePassSvelte,
    [Steps.ScanTicket]: ScanBarcodeTicketSvelte,
    [Steps.ConfirmEventlets]: SelectEventletsSvelte,
    [Steps.AttendeeMatching]: AttendeeMatchingSvelte,
}


interface StepItem {
    step: Steps;
    text: string;
    icon: typeof SvelteComponent | null;
    component: typeof SvelteComponent;
}

type StepIcons = {[key in Steps]: typeof SvelteComponent | null};
const stepIcons: StepIcons = {
    "Scan Vaccine Pass": null,
    "Scan Ticket": null,
    "Confirm Eventlets": null,
    "Attendee Matching": null,
}

export function generateSteps(attendeeProfile: AttendeeProfile) {
    let stepOrder: Steps[] = [];
    
    if (get(currentEvent).vaccine_pass_enabled) {
        stepOrder.push(Steps.ScanVaccinePass);
    }

    stepOrder = stepOrder.concat([
        Steps.ScanTicket,
        Steps.ConfirmEventlets
    ])

    console.log("step order, ", stepOrder);
    let steps: StepItem[] = stepOrder.map(step => {
        return {
            step,
            text: step.toString(),
            icon: stepIcons[step],
            component: StepComponents[step],
        }
    });
    
    return steps
}


export enum StageState {
    Incomplete,
    Complete,
    Warning,
    Stay
}

export interface AttendeeProfile {
    attendee: Attendee | null,
    covidPassInfo: NZCovidPass | null,
    ticket_eventlet_id: number | null,
    eventlet: number[]
}