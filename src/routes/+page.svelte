<script>
	import { auth } from '$lib/firebase';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import AllPosts from "../lib/components/AllPosts.svelte";
	import { onAuthStateChanged } from 'firebase/auth';
	import HomePagePost from '../lib/components/HomePagePost.svelte';

	let loggedInUser = null;
	let data = [];

	async function fetchUserHomePosts() {
		const response = await fetch('/api/user-posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ uid: loggedInUser.uid })
		});
		data = await response.json();
		data = data.posts;
	}

	onMount(() => {
		onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				// get the user from store
				user.subscribe((value) => {
					// compare the user.uid with the currentUser.uid
					if (value && value.uid === currentUser.uid) {
						console.log("user validated")
						loggedInUser = currentUser;
						fetchUserHomePosts();
					} else {
						loggedInUser = null;
						return;
					}
				});
			}
		});
	});
</script>

<h1>Page</h1>
<section class="home__feed">
	{#if loggedInUser}
		{#each data as item}
		  <HomePagePost post={item} />
		{/each}
	{:else}
		<AllPosts />
	{/if}
</section>
<style>
	.home__feed {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 758px;
	}
</style>
