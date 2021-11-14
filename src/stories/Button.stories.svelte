<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Button from '../lib/components/Button.svelte';
</script>

<Meta
	title="Button"
	component={Button}
	argTypes={{
		onclick: { action: 'onclick' },
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'warning']
		},
		size: {
			control: 'select',
			options: ['tiny', 'small', 'medium', 'large', 'expanded']
		},
		disabled: { control: 'boolean' },
		outline: { control: 'boolean' }
	}}
/>

<Template let:args>
	<Button {...args} on:click={args.onclick} />
</Template>

<Story
	name="Primary"
	args={{
		color: 'primary'
	}}
/>

<Story
	name="Secondary"
	args={{
		color: 'secondary'
	}}
/>

<Story
	name="Disabled"
	args={{
		disabled: true
	}}
/>

<Story
	name="Small"
	args={{
		size: 'small'
	}}
/>

<Story
	name="Large"
	args={{
		size: 'large'
	}}
/>
