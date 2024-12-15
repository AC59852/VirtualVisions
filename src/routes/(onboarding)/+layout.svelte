<script>
	import { auth } from '$lib/firebase';
	import { authStore } from '$lib/stores/user';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("user: ", user);
      authStore.update((current) => {
					console.log("updating")
          return {...current, isLoading: false, currentUser: user};
      });

			if(browser && !$authStore?.currentUser && !$authStore.isLoading && window.location.pathname === '/') {
				console.log(authStore.currentUser, authStore.isLoading);
				// window.location.href = '/signin';
			}
  	});
		return unsubscribe;
	});
</script>

 <svelte:head>
	<!-- no index -->
	<meta name="robots" content="noindex, nofollow" />
 </svelte:head>

{#if authStore.isLoading}
	<div>Loading...</div>
{:else}
	<section class="onboarding">
		<img src="/bck.webp" alt="" class="onboarding__bck">
		<slot />
	</section>
{/if}
<style>
	.onboarding {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
	}
	.onboarding__bck {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(10px) brightness(0.8);
		z-index: -1;
		transform: scale(1.1);
		object-position: center;
	}
</style>