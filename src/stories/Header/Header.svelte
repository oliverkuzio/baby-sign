<script lang="ts">
	import Button from '../Button/Button.svelte';

	interface Props {
		user?: { name: string };
		onLogin?: () => void;
		onLogout?: () => void;
		showMenu?: boolean;
		onToggleMenu?: () => void;
		onCloseMenu?: () => void;
		items?: { href: string; label: string }[];
	}

	const {
		user,
		onLogin,
		onLogout,
		showMenu,
		onToggleMenu,
		onCloseMenu,
		items = []
	}: Props = $props();
</script>

<header class="flex flex-row items-center justify-between p-4">
	<div>
		<a href="/" class="text-decoration-none inline-flex items-center">
			<svg
				fill="oklch(0.656 0.241 354.308)"
				width="32"
				height="32"
				viewBox="-32 0 512 512"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M91.434 483.987c-.307-16.018 13.109-29.129 29.13-29.129h62.293v-5.714H56.993c-16.021 0-29.437-13.111-29.13-29.129C28.16 404.491 40.835 392 56.428 392h126.429v-5.714H29.136c-16.021 0-29.437-13.111-29.13-29.129.297-15.522 12.973-28.013 28.566-28.013h154.286v-5.714H57.707c-16.021 0-29.437-13.111-29.13-29.129.297-15.522 12.973-28.013 28.566-28.013h168.566l-31.085-22.606c-12.762-9.281-15.583-27.149-6.302-39.912 9.281-12.761 27.15-15.582 39.912-6.302l123.361 89.715a34.287 34.287 0 0 1 14.12 27.728v141.136c0 15.91-10.946 29.73-26.433 33.374l-80.471 18.934a137.16 137.16 0 0 1-31.411 3.646H120c-15.593-.001-28.269-12.492-28.566-28.014zm73.249-225.701h36.423l-11.187-8.136c-18.579-13.511-20.313-40.887-3.17-56.536l-13.004-16.7c-9.843-12.641-28.43-15.171-40.88-5.088-12.065 9.771-14.133 27.447-4.553 39.75l36.371 46.71zm283.298-2.103l-5.003-152.452c-.518-15.771-13.722-28.136-29.493-27.619-15.773.518-28.137 13.722-27.619 29.493l1.262 38.415L283.565 11.019c-9.58-12.303-27.223-14.63-39.653-5.328-12.827 9.599-14.929 28.24-5.086 40.881l76.889 98.745-4.509 3.511-94.79-121.734c-9.58-12.303-27.223-14.63-39.653-5.328-12.827 9.599-14.929 28.24-5.086 40.881l94.443 121.288-4.509 3.511-77.675-99.754c-9.58-12.303-27.223-14.63-39.653-5.328-12.827 9.599-14.929 28.24-5.086 40.881l52.053 66.849c12.497-8.257 29.055-8.285 41.69.904l123.36 89.714c10.904 7.93 17.415 20.715 17.415 34.198v16.999l61.064-47.549a34.285 34.285 0 0 0 13.202-28.177z"
				/></svg
			>
			<span class="m-0 pl-2">Baby Sign</span>
		</a>
	</div>
	<nav
		class="ease-in-oute fixed top-0 right-0 bottom-0 z-[1045] flex w-96 max-w-full flex-col border-none bg-gray-800 bg-clip-padding text-white shadow-sm transition duration-300 outline-none {showMenu
			? 'translate-x-0'
			: 'translate-x-full'}"
		tabindex="-1"
		id="offcanvas"
		aria-labelledby="offcanvasExampleLabel"
	>
		<button
			type="button"
			class="absolute top-4 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 p-2 text-white hover:bg-white/0 focus:outline-none"
			onclick={onCloseMenu}
		>
			<span class="sr-only">Close menu</span>
			<!-- Heroicon name: outline/x -->
			<svg
				class="h-8 w-8"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="6"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
		<div class="px-3 py-5">
			<h5 class="mb-0 text-lg leading-normal font-semibold" id="offcanvasExampleLabel">Menu</h5>
		</div>
		<div class="items-center justify-between p-4 lg:flex">
			{#if items.length > 0}
				{#each items as item (item.label)}
					<a
						href={item.href}
						class="block px-4 py-2 text-lg font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
						onclick={onCloseMenu}>{item.label}</a
					>
				{/each}
			{/if}
		</div>
	</nav>
	<div class="flex items-center gap-2">
		{#if user}
			<Button size="small" onClick={onLogout} label="Log out" />
		{:else}
			<Button primary size="small" onClick={onLogin} label="Log in" />
		{/if}
		<button class="space-y-1" aria-label="Menu" aria-expanded="false" onclick={onToggleMenu}>
			<span class="block h-1 w-6 bg-white"></span>
			<span class="block h-1 w-6 bg-white"></span>
			<span class="block h-1 w-6 bg-white"></span>
		</button>
	</div>
</header>
