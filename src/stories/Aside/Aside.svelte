<script lang="ts">
	let { children } = $props();
</script>

<aside class="sticky bottom-0 mt-auto overflow-x-auto bg-gray-800">
	<div class="p-3">
		{@render children()}
	</div>
</aside>
