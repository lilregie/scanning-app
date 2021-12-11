<script lang="ts">
	import { eventAttendees } from '$lib/store';
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

    import Table from "$lib/components/Table.svelte";
    import type { TableRow } from "$lib/components/Table.svelte";
    import type { Attendee } from '$lib/attendee';
    import { titleCase } from '$lib/utill';

	export let givenName: string;
	export let lastName: string;
	export let DOB: string;

	let matchingAttendees = [];

    let tableData: TableRow[] = []

	onMount(() => {
		// givenName usually also includes middle name, so we will remove that
		let firstName = givenName.split(' ')[0];

		const attendees = get(eventAttendees);

		let fuse = new Fuse(attendees, {
			includeScore: true,
			keys: ['first_name', 'last_name'],
            threshold: 0.64,
		});
		matchingAttendees = fuse.search(`${firstName} ${lastName}`);
        console.log(matchingAttendees, attendees,`${firstName} ${lastName}`);
        tableData = matchingAttendees.map(fuseMatch => {
            let attendee: Attendee = fuseMatch.item;
            return {
                data: [
                    titleCase(`${attendee.first_name} ${attendee.last_name}`),
                    attendee.id.toString(),
                    `${((1-fuseMatch.score)*100).toFixed(2)}%`,
                ]
            }
        })
	});
</script>

{givenName}
{lastName}
{DOB}

<Table tableHeaders={["Name","ID","Certainty"]} tableData={tableData}/>

