<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

	import {formatDistance} from "date-fns";

	import Table from '../lib/components/Table.svelte';
    import {generateAttendeesForEvent} from "../lib/mocks/attendeeMock";
	import faker from 'faker';
	import { newestCheckIns } from '../lib/utill';

	faker.seed(1);
	let attendees = generateAttendeesForEvent(100);
	let checkIns = newestCheckIns(attendees);
	let tableData = checkIns.map(check_in=>[
			`${check_in[1].first_name}  ${check_in[1].last_name}`,
			`#${check_in[1].id}`,
			`${formatDistance(check_in[0].time, new Date(),{addSuffix: true})}`
		])
</script>

<Meta
	title="People Table"
	component={Table}
    argTypes={{ peopleCount: {control:'number'} }}
/>

<Template let:args>
	<Table tableHeaders={["Name","ID","Check In Time"]} tableData={tableData.slice(0,Math.max(0,args.peopleCount))}/>
</Template>

<Story name="default" args={{peopleCount: 10}} />

<style lang="scss">
	:root {
		font-family: 'Open Sans', Roboto, sans-serif, Arial;

	}
</style>