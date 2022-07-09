<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Card from '../lib/components/Card.svelte';
	import { faker } from '@faker-js/faker';
	faker.seed(1);
</script>

<Meta
	title="Card"
	component={Card}
	argTypes={{
		shadow: {
			control: 'select',
			options: [false, 'small', 'medium', 'large']
		},
		expand: { control: 'boolean' }
	}}
	parameters={{
		backgrounds: {
			default: 'light',
			values: [
				{ name: 'dark', value: '#222' },
				{ name: 'light', value: '#fff' }
			]
		}
	}}
/>

<Template let:args>
	<Card {...args}>
		<h1>Card Lorem Contents</h1>
		<p>
			{@html faker.lorem.paragraphs(4, '</p><p>')}
		</p>
	</Card>
</Template>

<Story name="default" args={{}} />

<Story name="No Shadow" args={{ shadow: false }} />
