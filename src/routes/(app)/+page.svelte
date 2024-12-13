<script>
	import { auth } from '$lib/firebase';
	import { authStore } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import AllPosts from "$lib/components/AllPosts.svelte";
	import HomePagePost from '$lib/components/HomePagePost.svelte';
	import { onAuthStateChanged } from 'firebase/auth';

	let posts = [];
	let userData;
	let loading = true; // Track loading state

	async function fetchUserHomePosts(userId) {
		try {
			const response = await fetch('/api/user-posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ uid: userId })
			});
			let data = await response.json();
			posts = data.posts;
		} catch (error) {
			console.error("Failed to fetch user home posts:", error);
		} finally {
			loading = false; // Stop loading after data is fetched
		}
	}

	async function getUser(userId) {
		try {
			const response = await fetch('/api/get-user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ uid: userId })
			});
			let data = await response.json();

			userData = data.user;
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	}

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				await fetchUserHomePosts(user.uid);
				await getUser(user.uid);
			}
		});
	});
</script>

<svelte:head>
	<title>Virtual Visions - Home</title>
	<meta name="description" content="Virtual Visions is a social media platform for gamers to share their experiences and connect with others by uploading beautiful images from your favourite games and allowing others to view and marvel at your content" />
	<meta name="keywords" content="gaming, social media, images, sharing, community, friends, games, virtual visions" />
	<meta name="author" content="Virtual Visions" />
	<!-- open graph -->
	<meta property="og:title" content="Virtual Visions - Home" />
	<meta property="og:description" content="Virtual Visions is a social media platform for gamers to share their experiences and connect with others by uploading beautiful images from your favourite games and allowing others to view and marvel at your content" />
</svelte:head>

<section class="home__feed">
	{#if loading}
		<!-- Loading spinner or message -->
		<div class="loading">
			<p>Loading your feed...</p>
			<!-- You can replace this with a spinner or animated loader -->
		</div>
	{:else}
		<section class="home__intro">
			<a href="/user/{userData?.uid}"><img src="{userData?.photoURL}" alt="Profile Icon for the user profile {userData?.displayName}" class="home__profileIcon"></a>
			<h2 class="home__name">Hello, {userData?.displayName}</h2>
			<a href="/post/new" class="home__link">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="home__post"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
			</a>
		</section>
		{#if posts.length > 0}
			{#each posts as item}
				<HomePagePost 
					post={item} 
					userLikes={userData?.likedPosts.includes(item.id)}
				/>
			{/each}
		{:else}
			<AllPosts />
		{/if}
	{/if}
</section>

<style>
	.home__feed {
		display: flex;
		flex-direction: column;
		max-width: 758px;
		margin: 0 auto;
	}

	.home__intro {
		display: flex;
		align-items: center;
		margin: 50px 0;
		position: relative;
		width: 100%;
		padding-bottom: 24px;
	}

	.home__intro::after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: #fff;
	}

	.home__profileIcon {
		width: 86px;
		height: 86px;
		border-radius: 50%;
	}

	.home__name {
		font-family: "Outfit", serif;
		font-optical-sizing: auto;
		font-size: 2.6rem;
		font-weight: 700;
		margin-left: 30px;
		color: white;
	}

	.home__post {
		width: 25px;
		height: 25px;
		fill: white;
		margin-left: 14px;
		display: flex;
		margin-top: 10px;
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		color: white;
		font-size: 1.5rem;
		font-family: "Outfit", serif;
	}
</style>