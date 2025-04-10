<script lang="ts">
	import Button from '../Button/Button.svelte';

	interface Props {
		items?: { href: string; label: string }[];
	}

	const { items = [] }: Props = $props();
</script>

<nav
	class="dark:bg-body-dark invisible fixed top-0 bottom-0 left-0 z-[1045] flex w-96 max-w-full -translate-x-full flex-col border-none bg-white bg-clip-padding text-neutral-700 shadow-sm transition duration-300 ease-in-out outline-none data-[twe-offcanvas-show]:transform-none dark:text-white"
	tabindex="-1"
	id="offcanvasExample"
	aria-labelledby="offcanvasExampleLabel"
	data-twe-offcanvas-init
>
	<div class="flex items-center justify-between p-4">
		<h5 class="mb-0 leading-normal font-semibold" id="offcanvasExampleLabel">Menu</h5>
		{#if items.length > 0}
			{#each items as item (item.label)}
				<a
					href={item.href}
					class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
					>{item.label}</a
				>
			{/each}
		{/if}
	</div>
</nav>
