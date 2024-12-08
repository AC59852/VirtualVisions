<script>
  import { auth } from '$lib/firebase';
  import { authStore } from '$lib/stores/user';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import NavMenuComponent from '$lib/components/NavMenuComponent.svelte';
  import { get } from 'svelte/store';

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
</script>

{#if $authStore.isLoading}
  <div>Loading...</div>
{:else}
  <NavMenuComponent user={$authStore.currentUser?.uid} />
  <slot />
{/if}