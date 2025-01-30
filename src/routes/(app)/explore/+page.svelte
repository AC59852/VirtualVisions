<script>
	import { onMount } from 'svelte';
	import PostComponent from '$lib/components/user/PostComponent.svelte';
	import PostModal from '$lib/components/user/PostModal.svelte';
	import { pushState } from '$app/navigation';
	import UserFollowComponent from '$lib/components/user/UserFollowComponent.svelte';

	export let data;

	let userData = [];
	let posts = [];
	let { searchQuery } = data;
	let lastVisible = null; // Track the last visible document for pagination
	let isLoading = false;
	let selectedPost = null;
	let isEndReached = false; // New variable to track if all posts are loaded
	let search = searchQuery || '';
	let initialSearch = search;

	// Fetch posts from the server
	async function loadPosts() {
		if (isLoading || isEndReached) return; // Prevent duplicate requests and stop if we've reached the end
		isLoading = true;

		try {
			const response = await fetch('/api/all-posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lastVisible, limit: 15 }),
			});

			const result = await response.json();

			if (response.ok) {
				// Add new posts to the array
				posts = [...posts, ...result.posts];

				// Check if there are no more posts to load
				if (result.posts.length < 15) {
					isEndReached = true; // Mark the end as reached
				}

				// Update lastVisible
				lastVisible = result.lastVisible;
			} else {
				console.error('Failed to fetch posts:', result.error);
			}
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			isLoading = false;
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
				userData = result.body;
			} else {
				userData = [];
			}
		} catch (error) {
			console.error('Error searching users:', error);
			userData = [];
		}
	}

	async function handleSearchSubmit(event) {
		event.preventDefault();

		if (search !== initialSearch) {
			if (search) {
				pushState(`/explore?search=${search}`);
				searchUsers();
			} else {
				pushState('/explore');
				loadPosts();
				userData = [];
			}
			initialSearch = search;
		}
	};

	// Handle infinite scrolling
	function handleScroll() {
		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
		if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && !isEndReached) {
			loadPosts();
		}
	};

	// Load initial posts on mount
	onMount(() => {
		// loadPosts();

		// window.addEventListener('scroll', handleScroll);
		// return () => window.removeEventListener('scroll', handleScroll);

		if(search) {
			searchUsers();
		} else {
			loadPosts();
			window.addEventListener('scroll', handleScroll);
			return () => window.removeEventListener('scroll', handleScroll);
		}
	});

	async function openPost(post) {
		selectedPost = {
			...post,
			userName: post.userName, // Ensure these fields exist in your API response
			userPhoto: post.userPhoto
		};
	}

	async function closeModal() {
		selectedPost = null;
	}
</script>

<svelte:head>
	<title>Virtual Visions | Explore</title>
</svelte:head>

<section class="explore">
	<form on:submit={handleSearchSubmit} class="explore__form">
		<input
			type="text"
			name="search"
			id="search"
			class="explore__search"
			placeholder="Search users"
			bind:value={search} />
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
		{#if posts.length > 0}
			<section class="posts">
				{#each posts as post}
					<a
						href="/user/{post.account}/post/{post.id}"
						on:click={(e) => { e.preventDefault(); openPost(post); }}>
						<PostComponent post={post} />
					</a>
				{/each}
			</section>
		{:else}
			<p>No posts</p>
		{/if}

		{#if selectedPost}
    	<PostModal post={selectedPost} userName={selectedPost.userName} userPhoto={selectedPost.userPhoto} on:close={closeModal} />
		{/if}

		{#if isLoading}
			<p>Loading...</p>
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