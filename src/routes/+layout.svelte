<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Page from '$lib/components/Page.svelte';
	import '../app.css';

	let showMenu = $state<boolean>();

	let { children } = $props();

	let items = [
		{ href: '/', label: 'Home' },
		{ href: '/dictionary', label: 'Dictionary' },
		{ href: '/phrases', label: 'Phrases' },
		{ href: '/songs', label: 'Songs' }
	];
</script>

<Page>
	<Header
		{showMenu}
		onToggleMenu={() => (showMenu = !showMenu)}
		onCloseMenu={() => (showMenu = false)}
		{items}
	/>
	<main class="relative flex grow flex-col items-stretch">
		{@render children?.()}
	</main>
	<Footer />
</Page>
