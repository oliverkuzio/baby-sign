<script lang="ts">
	import Header from '../stories/Header/Header.svelte';
	import Footer from '../stories/Footer/Footer.svelte';
	import Page from '../stories/Page/Page.svelte';
	import '../app.css';

	let user = $state<{ name: string }>();
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
		{user}
		onLogin={() => (user = { name: 'Jane Doe' })}
		onLogout={() => (user = undefined)}
		{showMenu}
		onToggleMenu={() => (showMenu = !showMenu)}
		onCloseMenu={() => (showMenu = false)}
		{items}
	/>
	<main class="relative flex grow flex-col items-stretch">
		{#if user}
			<div class="p-3">
				<h5 class="mb-0 leading-normal font-semibold" id="offcanvasExampleLabel">
					Welcome, <b>{user.name}</b>!
				</h5>
			</div>
		{/if}
		{@render children?.()}
	</main>
	<Footer />
</Page>
