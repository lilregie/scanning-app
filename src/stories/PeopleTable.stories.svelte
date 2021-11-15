<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

	import PeopleTable from '../lib/components/PeopleTable.svelte';
    import {generateLatestCheckIns} from "../lib/mocks/attendeeMock";
	import faker from 'faker';
	faker.seed(1);
</script>

<Meta
	title="People Table"
	component={PeopleTable}
    argTypes={{ peopleCount: {control:'number'} }}
/>

<Template let:args>
	<PeopleTable peopleList={generateLatestCheckIns(args.peopleCount)}/>
</Template>

<Story name="default" args={{peopleCount: 10}} />

<style lang="scss">
	:root {
		font-family: 'Open Sans', Roboto, sans-serif, Arial;

	}
</style>