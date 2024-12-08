<script>
	import { auth } from '$lib/firebase';
	import { authStore } from '$lib/stores/user';
	import { onAuthStateChanged } from 'firebase/auth';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let authInitialized = false; // Track if auth is fully initialized

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log(user);
      authStore.update((current) => {
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

{#if authStore.isLoading}
	<div>Loading...</div>
{:else}
	<slot />
{/if}