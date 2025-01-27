<script>
	import { onMount } from 'svelte';
	import PostComponent from '$lib/components/user/PostComponent.svelte';
	import PostModal from '$lib/components/user/PostModal.svelte';

	let posts = [];
	let lastVisible = null; // Track the last visible document for pagination
	let isLoading = false;
	let selectedPost = null;
	let isEndReached = false; // New variable to track if all posts are loaded

	// Fetch posts from the server
	async function loadPosts() {
		if (isLoading || isEndReached) return; // Prevent duplicate requests and stop if we've reached the end
		isLoading = true;

		try {
			console.log('Loading posts, lastVisible:', lastVisible);

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

	// Load initial posts on mount
	onMount(() => {
		loadPosts();
	});

	// Handle infinite scrolling
	function handleScroll() {
		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
		if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && !isEndReached) {
			loadPosts();
		}
	}

	// Listen for scroll events
	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	async function openPost(post) {
		selectedPost = post;
	}

	async function closeModal() {
		selectedPost = null;
	}
</script>

<svelte:head>
	<title>Virtual Visions | Explore</title>
</svelte:head>

<section class="explore">
	<h1>Explore</h1>

	<section class="posts">
		{#each posts as post}
			<div on:click={() => openPost(post)}>
				<PostComponent post={post} />
			</div>
		{/each}
	</section>

	{#if isLoading}
		<p>Loading more posts...</p>
	{/if}

	{#if selectedPost}
		<PostModal post={selectedPost} on:close={closeModal} />
	{/if}

	{#if isEndReached}
		<p>No more posts available.</p> <!-- Show message when end is reached -->
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