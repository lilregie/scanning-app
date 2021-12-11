<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Search from '../lib/components/Search.svelte';

    let searchTerm = "";
</script>

<Meta
	title="Search"
	component={Search}
	argTypes={{
		size: {
			control: 'select',
			options: ['tiny', 'small', 'medium', 'large', 'expanded']
		},
        placeholder: {
            control: 'text'
        },
		disabled: { control: 'boolean' },
	}}
/>

<Template let:args>
    <div>Searching for "{searchTerm}"</div>
	<Search {...args} bind:searchTerm />
</Template>

<Story
	name="Disabled"
	args={{
		disabled: true
	}}
/>

<Story
	name="Tiny"
	args={{
		size: 'tiny'
	}}
/>

<Story
	name="Small"
	args={{
		size: 'small'
	}}
/>

<Story
	name="Medium"
	args={{
		size: 'medium'
	}}
/>

<Story
	name="Large"
	args={{
		size: 'large'
	}}
/>

<Story
	name="Expanded"
	args={{
		size: 'expanded'
	}}
/>

<Story
	name="Placeholder Text"
	args={{
		placeholder: 'Search for something...'
	}}
/>