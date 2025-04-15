<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import NavCard from './NavCard.svelte';
	import { fn } from '@storybook/test';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Example/NavCard',
		component: NavCard,
		// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
		tags: ['autodocs'],
		parameters: {
			// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
			layout: 'fullscreen'
		},
		args: {
			href: String,
			label: String
		}
	});
</script>

<Story name="Logged In" args={{ user: { name: 'Ashleigh Kuzio' } }} />

<Story name="Logged Out" />
