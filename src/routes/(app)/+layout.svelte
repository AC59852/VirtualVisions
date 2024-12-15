<script>
  import { auth } from '$lib/firebase';
  import { authStore } from '$lib/stores/user';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import NavMenuComponent from '$lib/components/NavMenuComponent.svelte';
  import { signOut } from 'firebase/auth';
  import { goto } from '$app/navigation';

  // Update authStore on auth state changes
  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('User state changed:', user);

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
      goto('/signin');
    }
  }
  }

  async function VVSignOut() {
  try {
    await signOut(auth); // Perform the sign-out
    authStore.set({ currentUser: null, isLoading: false }); // Clear the user store immediately
    console.log('User signed out');
    goto('/signin');
  } catch (e) {
    console.error('Sign out error:', e);
  }
}
</script>
  {#if $authStore.isLoading}
    <p class="loading">Loading...</p>
  {/if}
  <div class="{ $authStore.isLoading ? 'loading--hide' : '' }">
    <button on:click={VVSignOut} class="signout">Sign Out <span>></span></button>
    <NavMenuComponent user={$authStore.currentUser?.uid} />
    <slot />
  </div>
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

  .loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		color: white;
		font-size: 1.5rem;
		font-family: "Outfit", serif;
	}

  .loading--hide {
    display: none !important;
  }
</style>