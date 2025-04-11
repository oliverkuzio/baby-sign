<script lang="ts">
	let { children } = $props();
</script>

<section class="p-3">
	{@render children?.()}
</section>
