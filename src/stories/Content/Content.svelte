<script lang="ts">
	let { children } = $props();
</script>

<section class="px-4 py-10">
	{@render children?.()}
</section>
