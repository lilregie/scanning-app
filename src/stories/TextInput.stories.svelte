<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import TextInput from '../lib/components/TextInput.svelte';

    let textInputValue = "";
</script>

<Meta
	title="Text Input"
	component={TextInput}
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
    <div>Input: "{textInputValue}"</div>
	<TextInput {...args} bind:textInputValue />
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