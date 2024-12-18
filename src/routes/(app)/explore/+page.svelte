<script>
	import { pushState } from '$app/navigation';
	import { onMount } from 'svelte';
	import PostComponent from "$lib/components/user/PostComponent.svelte";
	import PostModal from "$lib/components/user/PostModal.svelte";
	import UserFollowComponent from '../../../lib/components/user/UserFollowComponent.svelte';
	export let data;

	let userData = [];
	let { posts, selectedPost, searchQuery } = data;
	let search = searchQuery || ''; // Initialize search with the query parameter, or empty if undefined
	let initialSearch = search; // Track the initial search value
	let userName;
	let userPhoto;

	// Run searchUsers only in the browser
	onMount(() => {
		if (search) {
			searchUsers();
		}
	});

	// Handle form submission and update the URL only when the user submits
	async function handleSearchSubmit(event) {
		event.preventDefault(); // Prevent default form submission behavior

		// Only submit if the search query has changed
		if (search !== initialSearch) {
			if (search) {
				// Update the URL only when the user submits the search
				pushState(`/explore?search=${search}`);
				searchUsers();
			} else {
				// Clear search and reset URL when search is cleared
				pushState('/explore');
				userData = []; // Optionally reset the userData if search is cleared
			}
			initialSearch = search; // Update initial search to the current search query after submission
		} else {
			console.log('Search query has not changed. Not submitting.');
		}
	}

	async function searchUsers() {
		try {
			const response = await fetch('/api/get-users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ search })
			});

			const result = await response.json();

			if (response.ok) {
				console.log('Search results:', result.body);
				userData = result.body;
			} else {
				userData = [];
			}
		} catch (error) {
			console.error('Error searching users:', error);
			userData = [];
		}
	}

	async function openPost(post) {
		await pushState(`/user/${post.account}/post/${post.id}`);

		try {
			const response = await fetch(`/api/get-user`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ uid: post.account })
			});

			const result = await response.json();

			if (response.ok) {
				console.log('User:', result);
				userName = result.user.displayName;
				userPhoto = result.user.photoURL;
			} else {
				console.error('Error getting user:', result.error);
			}
		}
		catch (error) {
			console.error('Error getting user:', error);
		}



		console.log(post)

		selectedPost = post;
	}

	async function closeModal() {
		await pushState(`/explore`);
		selectedPost = null;
	}
</script>

<svelte:head>
	<title>Virtual Visions | Explore</title>
	<meta name="description" content="Explore the latest posts from the Virtual Visions community, viewing astonishing and breathtaking photos from gamers just like yourself." />
	<meta property="og:title" content="Virtual Visions | Explore" />
	<meta property="og:description" content="Explore the latest posts from the Virtual Visions community, viewing astonishing and breathtaking photos from gamers just like yourself." />
	<meta property="og:image" content="/vv-logo.png" />
	<meta property="og:url" content="https://virtual-visions-red.vercel.app/explore" />
	<!-- twitter card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@virtualvisions" />
	<meta name="twitter:title" content="Virtual Visions | Explore" />
	<meta name="twitter:description" content="Explore the latest posts from the Virtual Visions community, viewing astonishing and breathtaking photos from gamers just like yourself." />
	<meta name="twitter:image" content="/vv-logo.png" />
	<!-- robots follow and index -->
	<meta name="robots" content="follow, index" />
</svelte:head>

<section class="explore">
	<form on:submit={handleSearchSubmit} class="explore__form">
		<input type="text" name="search" id="search" class="explore__search" placeholder="Search users" bind:value={search} />
	</form>

	{#if userData !== undefined && userData.length > 0}
		<section class="explore__wrapper">
			<h2 class="explore__title explore__title--search">Search results for: {search}</h2>
			<section class="explore__users">
				{#each userData as user}
					<UserFollowComponent user={user} />
				{/each}
			</section>
		</section>
	{/if}

	<!-- hide explore if the user searched for someone -->
	{#if userData.length === 0}
		<h1 class="explore__title explore__title--main">Explore</h1>
		{#if posts.length > 0 }
			<section class="posts">
				{#each posts as post}
					<a href="/user/{post.account}/post/{post.id}" on:click={(e) => { e.preventDefault(); openPost(post); }}>
						<PostComponent post={post} />
					</a>
				{/each}
			</section>
		{:else}
			<p>No posts</p>
		{/if}

		{#if selectedPost}
			<PostModal post={selectedPost} userName={userName} userPhoto={userPhoto} on:close={closeModal} />
		{/if}
	{/if}
</section>

<style>
	.explore {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		max-width: 939px;
	}

	.explore__form {
		margin: 60px 0;
		align-self: center;
		width: 50%;
		max-width: 420px;
	}

	.explore__search {
		width: 100%;
		padding: 12px 16px;
		border: 1px solid #E5E7EB;
		box-sizing: border-box;
		border-radius: 500000px;
	}

	.explore__title {
		font-family: 'Outfit', sans-serif;
		font-size: 3.25rem;
		color: white;
		font-weight: bold;
		margin-left: -3rem;
	}

	.explore__title--main {
		margin-bottom: 42px;
	}

	.posts {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		width: 100%;
		gap: 4px;
	}

	.explore__wrapper {
		position: relative;
	}

	.explore__users {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 3rem;
		width: 100%;
		margin-top: 3rem;
	}
</style>