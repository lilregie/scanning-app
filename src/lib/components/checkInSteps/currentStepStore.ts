import { tick } from "svelte";
import { writable, type Writable } from "svelte/store";
import type { StepItem } from "./stepManager";

export class CurrentSteps {
    public steps: StepItem[] = null;
    idStore: Writable<number> = null;
    public currentStep: StepItem = null;
    public currentStepID: number = 0;

    idUnsubscribe = null;
    
   
    constructor(startingID: number, steps: StepItem[]) {
        this.idStore = writable(startingID);
        this.steps = steps;
        
        this.idStore.subscribe(async (id) => {
            this.currentStepID = id;

            // By waiting a tick before setting the current step, we ensure that the previous step has had a chance to destory itself
            // Workaround for following issues
            //
            // https://github.com/sveltejs/svelte/issues/7458
            // https://github.com/sveltejs/svelte/issues/7119
            //
            // TODO: Remove once these issues are resolved
            this.currentStep = null;
            console.log("waiting for tick",id);
            await tick();
            console.log("awaiting for tick",id,this.steps);
            this.currentStep = this.steps[id];
        })
    }
   
    nextStep() {
        this.idStore.update((id) => {
            if (id < this.steps.length - 1) {
                return id + 1;
            }
            return id;
        });
    }

    previousStep() {
        this.idStore.update((id) => {
            if (id > 0) {
                return id - 1;
            }
            return id;
        });
    }

    deconstruct() {
        if (this.idUnsubscribe) {
            this.idUnsubscribe();
        }
    }
  }
  