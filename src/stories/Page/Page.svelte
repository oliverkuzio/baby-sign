<script lang="ts">
	import Header from '../Header/Header.svelte';
	import Footer from '../Footer/Footer.svelte';

	let user = $state<{ name: string }>();
	let { children } = $props();
</script>

<article class="flex min-h-screen flex-col items-stretch bg-gray-900 text-white">
	<Header
		{user}
		onLogin={() => (user = { name: 'Jane Doe' })}
		onLogout={() => (user = undefined)}
		onCreateAccount={() => (user = { name: 'Jane Doe' })}
	/>
	<main class="relative flex grow flex-col items-stretch">
		{@render children?.()}
	</main>
	<Footer />
</article>
