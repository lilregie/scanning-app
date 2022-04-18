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
import type { Eventlet } from "$lib/event";

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

export function generateSteps(attendeeProfile: AttendeeProfile): [StepItem[], number] {
    let stepOrder: Steps[] = [];
    let completedSteps: Steps[] = [];

    const addStep = (step: Steps,completed: any) => (completed ? completedSteps.push(step) : stepOrder.push(step));
    
    addStep(Steps.ScanTicket, attendeeProfile.ticket_eventlet);

    if (get(currentEvent).vaccine_pass_enabled) {
        addStep(Steps.ScanVaccinePass, attendeeProfile.covidPass);
    }

    addStep(Steps.ConfirmEventlets, false); // always confirm eventlets

    stepOrder = [...completedSteps, ...stepOrder];
    console.log("step order",stepOrder, completedSteps);

    let steps: StepItem[] = stepOrder.map(step => {
        return {
            step,
            text: step.toString(),
            icon: stepIcons[step],
            component: StepComponents[step],
        }
    });
    
    return [steps, completedSteps.length];
}

export function initiateCheckIn(attendeeProfile: AttendeeProfile) {
    console.log("Starting check in");
}


export enum StageState {
    Incomplete,
    Complete,
    Warning,
    Stay
}

export interface AttendeeProfile {
    attendee: Attendee | null,
    covidPass: boolean,
    ticket_eventlet: Eventlet | null,
    check_in_eventlet: Eventlet | null
}