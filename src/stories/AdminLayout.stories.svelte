<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import AdminLayout from '../lib/components/layouts/AdminLayout.svelte';
	import { faker } from '@faker-js/faker';
</script>

<Meta
	title="Admin Layout"
	component={AdminLayout}
	argTypes={{}}
	parameters={{
		backgrounds: {
			default: 'dark',
			values: [
				{ name: 'dark', value: '#222' },
				{ name: 'light', value: '#fff' }
			]
		}
	}}
/>

<Template let:args>
	<AdminLayout {...args}>
		<div slot="left-bar">
			<h1>Left Bar</h1>
			<p>
				{@html faker.lorem.paragraphs(4, '</p><p>')}
			</p>
		</div>
		<div slot="info-panel">
			<h1>Info Panel</h1>
			<p>
				{@html faker.lorem.paragraphs(1, '</p><p>')}
			</p>
		</div>
		<div slot="list-panel">
			<h1>List Panel</h1>
			<p>
				{@html faker.lorem.paragraphs(1, '</p><p>')}
			</p>
		</div>
	</AdminLayout>
</Template>

<Story name="default" />
