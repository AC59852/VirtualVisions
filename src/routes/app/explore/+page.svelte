<script>
	import AllPosts from '$lib/components/AllPosts.svelte';
	let component = AllPosts;

	let data;

	async function searchUsers() {
		let search = document.getElementById('search').value;
		const response = await fetch('/api/get-users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ search: search })
		});

		data = await response.json();
		// if the response is 200, assign data to the returned array of users
		if (response.status === 200) {
			data = data.body;
			console.log(data);
		} else {
			// if the response is not 200, assign an empty array to data
			data = [];
		}
	}
</script>

<h1>Page</h1>
<form action="" on:submit={searchUsers}>
	<input type="text" name="search" id="search" placeholder="Search users" />
</form>
{#if data}
	<h1>users</h1>
	{#each data as user}
		<p>{user.displayName}</p>
	{/each}
{/if}
<svelte:component this={component}></svelte:component>
