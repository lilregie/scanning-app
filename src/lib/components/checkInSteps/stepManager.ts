import { currentEvent } from "$lib/store";
import type { SvelteComponent } from "svelte";
import { get } from "svelte/store";

export enum Steps {
    ScanVaccinePass = "Scan Vaccine Pass",
    ScanTicket = "Scan Ticket",
    Confirm = "Confirm",
}



interface StepItem {
    step: Steps;
    text: string;
    icon: SvelteComponent;
}

type StepIcons = {[key in Steps]: SvelteComponent | null};
const stepIcons: StepIcons = {
    "Scan Vaccine Pass": null,
    "Scan Ticket": null,
    "Confirm": null,
}

export function generateSteps() {
    let stepOrder: Steps[] = [];
    if (get(currentEvent).vaccine_pass_enabled) {
        stepOrder.push(Steps.ScanVaccinePass);
    }
    stepOrder = stepOrder.concat([
        Steps.ScanTicket,
        Steps.Confirm
    ])
    console.log("step order, ", stepOrder);
    let steps: StepItem[] = stepOrder.map(step => {
        return {
            step,
            text: step.toString(),
            icon: stepIcons[step]
        }
    });
    
    return steps
}