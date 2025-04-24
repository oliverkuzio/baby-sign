<script lang="ts">
	let { children } = $props();
</script>

<div class="justify-content-center flex flex-nowrap gap-4 overflow-x-auto">
	{@render children()}
</div>
