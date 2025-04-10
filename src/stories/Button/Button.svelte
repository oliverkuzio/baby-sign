<script lang="ts">
	interface Props {
		/** Is this the principal call to action on the page? */
		primary?: boolean;
		/** What background color to use */
		backgroundColor?: string;
		/** How large should the button be? */
		size?: 'small' | 'medium' | 'large';
		/** Button contents */
		label: string;
		/** The onclick event handler */
		onClick?: () => void;
	}

	const { primary = false, backgroundColor, size = 'medium', label, onClick }: Props = $props();
</script>

<button
	type="button"
	class="
    {primary ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-800'}
    {size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'}
    focus:ring-opacity-50
    rounded px-4
    py-2
    hover:bg-pink-700
    focus:ring-2
    focus:ring-pink-500
    focus:outline-none
  "
	style:background-color={backgroundColor}
	on:click={onClick}
>
	{label}
</button>
