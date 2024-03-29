import type { Attendee } from "$lib/attendee";
import { currentEvent, stepManagerSettings } from "$lib/store";
import type { SvelteComponent } from "svelte";
import { get, writable, type Writable } from "svelte/store";

// Steps (TS doesn't like importing svelte files)
import ScanBarcodeTicketSvelte from "./steps/ScanBarcodeTicket.svelte";
import SelectEventletsSvelte from "./steps/SelectEventlets.svelte";
import ConfirmCheckinSvelte from "./steps/ConfirmCheckin.svelte";

// Icons
import ScanVaccinePassICON from "./stepIcons/ScanVaccinePass.svelte";
import ScanBarcodeTicketICON from "./stepIcons/ScanBarcodeTicket.svelte";
import SelectEventletsICON from "./stepIcons/SelectEventlets.svelte";
import type { Eventlet } from "$lib/event";

export enum Steps {
	ScanVaccinePass = "Scan Vaccine Pass",
	ScanTicket = "Scan Ticket",
	ConfirmEventlets = "Confirm Eventlets",
	ConfirmCheckin = "Confirm Checkin",
}

export const StepComponents = {
	[Steps.ScanTicket]: ScanBarcodeTicketSvelte,
	[Steps.ConfirmEventlets]: SelectEventletsSvelte,
	[Steps.ConfirmCheckin]: ConfirmCheckinSvelte
}

export interface StepItem {
	step: Steps;
	text: string;
	memory: Writable<any>;
	icon: typeof SvelteComponent | null;
	component: typeof SvelteComponent;
}

type StepIcons = { [key in Steps]: typeof SvelteComponent | null };
const stepIcons: StepIcons = {
	"Scan Vaccine Pass": ScanVaccinePassICON,
	"Scan Ticket": ScanBarcodeTicketICON,
	"Confirm Eventlets": SelectEventletsICON,
	"Confirm Checkin": null
}

export type StepData = [number, StepItem[]];

export function generateSteps(attendeeProfile: AttendeeProfile, settings: StepManagerSettings): StepData {
	console.log(attendeeProfile)
	const event = get(currentEvent);
	let stepOrder: Steps[] = [];
	let completedSteps: Steps[] = [];

	const addStep = (step: Steps, completed: any) => (completed ? completedSteps.push(step) : stepOrder.push(step));

	if (settings.scanTicket) {
		addStep(Steps.ScanTicket, attendeeProfile.ticketKey);
	}

	if (event?.vaccine_pass_required && settings.scanVaccinePass) {
		addStep(Steps.ScanVaccinePass, attendeeProfile.covidPass);
	}

	if (!event?.standalone) {
		addStep(Steps.ConfirmEventlets, false); // always confirm eventlets if enabled
	}
	console.log("step order",completedSteps, stepOrder);

	if (stepOrder.length == 0) {
		addStep(Steps.ConfirmCheckin, false); // Add a confirm step if no steps are required
	}

	stepOrder = [...completedSteps, ...stepOrder];

	let steps: StepItem[] = stepOrder.map(step => {
		return {
			step,
			text: step.toString(),
			memory: writable(null),
			icon: stepIcons[step],
			component: StepComponents[step],
		}
	});

	return [completedSteps.length, steps];
}

// If the step manager outputs no steps, this is used as a backup to let the user submit
export const backupStep = {
	step: Steps.ConfirmCheckin,
	text: Steps.ConfirmCheckin.toString(),
	memory: writable(null),
	icon: stepIcons[Steps.ConfirmCheckin],
	component: StepComponents[Steps.ConfirmCheckin],
}

export enum StageState {
	Incomplete,
	Complete,
	Warning,
	Stay,
	Loading
}

export interface AttendeeProfile {
	attendee: Attendee | null,
	covidPass?: boolean,
	checkInEventlet?: Eventlet | null
	ticketKey: string | null,
}

export interface StepManagerSettings {
	scanTicket: boolean,
	scanVaccinePass: boolean
}
