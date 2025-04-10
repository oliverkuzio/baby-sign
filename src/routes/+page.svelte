<script lang="ts">
	import type { PageData } from './$types';
	import Content from '../stories/Content/Content.svelte';
	import NavCard from '../stories/NavCard/NavCard.svelte';

	export let data: PageData;

	const words = data.words;
	console.log(words);
</script>

<Content>
	<h1 class="mb-3 text-2xl leading-none font-extrabold">Baby Sign</h1>
	<p class="mb-3">Welcome to the Baby Sign app!</p>
	<nav>
		<ul class="align-center grid grid-cols-1 justify-center gap-3 md:grid-cols-2 xl:grid-cols-3">
			<li>
				<NavCard
					href="/dictionary"
					label="Dictionary"
					description="See the full list of words to sign!"
				/>
			</li>
			<li>
				<NavCard
					href="/phrases"
					label="Phrases"
					description="See some common phrases to learn and sign!"
				/>
			</li>
			<li>
				<NavCard href="/songs" label="Songs" description="See some songs to sing and sign!" />
			</li>
		</ul>
	</nav>
</Content>
