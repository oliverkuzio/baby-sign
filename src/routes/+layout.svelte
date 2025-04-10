<script lang="ts">
	import Page from '../stories/Page/Page.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<Page>
	{@render children()}
</Page>
