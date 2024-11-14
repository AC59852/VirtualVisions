<script>
	import { onMount } from 'svelte';

	let data = [];

	async function fetchData() {
		const response = await fetch('/api/all-posts');
		data = await response.json();
		console.log(data);
	}

	// Trigger fetch data on component mount
	onMount(() => {
		fetchData();
	});
</script>

<h1>Test</h1>
{#each data as item}
	<div>
		<h2>{item.title}</h2>
		{#if item.imageUrl}
			<img
				src={item.imageUrl}
				alt={item.title}
				style="width: 800px; height: 587px; object-fit: cover; object-position: center;"
			/>
		{/if}
	</div>
{/each}
