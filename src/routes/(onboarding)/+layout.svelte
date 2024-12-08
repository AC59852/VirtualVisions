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

{#if authStore.isLoading}
	<div>Loading...</div>
{:else}
	<slot />
{/if}