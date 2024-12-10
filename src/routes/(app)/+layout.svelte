<script>
  import { auth } from '$lib/firebase';
  import { authStore } from '$lib/stores/user';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import NavMenuComponent from '$lib/components/NavMenuComponent.svelte';
  import { signOut } from 'firebase/auth';

  // Update authStore on auth state changes
  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      authStore.update((current) => ({
        ...current,
        currentUser: user,
        isLoading: false,
      }));
    });

    return unsubscribe;
  });

  // Reactive block for handling redirection
  $: {
    if (browser && !$authStore.isLoading) {
      if (!$authStore.currentUser && ['/post/new', '/'].includes(window.location.pathname)) {
        console.log("Redirecting to /signin...");
        window.location.href = '/signin';
      }
    }
  }

  async function VVSignOut() {
		try {
			await signOut(auth); // Perform the sign-out
			authStore.currentUser.set(null); // Clear the user store immediately
			console.log('User signed out');
      goto('/signin')
		} catch (e) {
			console.error('Sign out error:', e);
		}
	}
</script>

{#if $authStore.isLoading}
  <div>Loading...</div>
{:else}
  <button on:click={VVSignOut} class="signout">Sign Out <span>></span></button>
  <NavMenuComponent user={$authStore.currentUser?.uid} />
  <slot />
{/if}
<style>
  .signout {
    font-family: "Outfit", sans-serif;
    font-size: 1rem;
    color: white;
    background-color: transparent;
    border: none;
    position: absolute;
    top: 14px;
    right: 14px;
    cursor: pointer;
  }

  .signout span {
    color: red;
  }
</style>