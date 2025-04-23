<script lang="ts">
	import Content from '$lib/components/Content.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<Content>
	<h1 class="mb-3 text-2xl leading-none font-extrabold">Add Word</h1>
	<form action="" class="mb-3">
		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-white" for="username">Slug</label>
			<input
				class="focus:shadow-outline w-full appearance-none rounded border border-gray-500 px-3 py-2 leading-tight text-white shadow focus:outline-none"
				id="slug"
				type="text"
				placeholder="Enter slug"
			/>
		</div>
		<div class="flex items-center justify-between">
			<Button primary label="Add word" onClick={() => false} />
		</div>
	</form>
</Content>
