<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
    import SuccessTick from "../lib/components/SuccessTick.svelte"

</script>

<Meta
	title="SuccessTick"
	component={SuccessTick}
	argTypes={{
		visible: { control: 'boolean' },
		color: {
			control: 'color',
		}
	}}
/>

<Template let:args>
	<div>
		<SuccessTick visible={args.visible} colour={args.color}/>

	</div>
</Template>

<Story
	name="Primary"
	args={{
		visible: true,
		color: 'green',
	}}
/>