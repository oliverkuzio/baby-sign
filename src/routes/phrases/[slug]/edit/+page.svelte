<script lang="ts">
	import type { PageData } from '../../$types.js';
	import Content from '../../../../stories/Content/Content.svelte';
	import Button from '../../../../stories/Button/Button.svelte';

	export let data: PageData;

	const phrase = data.phrase;
</script>

<Content>
	<h1 class="mb-3 text-2xl leading-none font-extrabold">Edit Phrase</h1>
	<form action="" class="mb-3">
		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-white" for="slug">Slug</label>
			<input
				class="focus:shadow-outline w-full appearance-none rounded border border-gray-500 px-3 py-2 leading-tight text-white shadow focus:outline-none"
				name="slug"
				id="slug"
				type="text"
				value={phrase.slug}
				placeholder="Enter slug"
			/>
		</div>
		<div class="flex items-center justify-between">
			<Button primary label="Edit phrase" onClick={() => false} />
		</div>
	</form>
</Content>
