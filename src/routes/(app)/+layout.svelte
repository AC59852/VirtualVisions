<script>
  import { auth } from '$lib/firebase';
  import { authStore } from '$lib/stores/user';
  import { onAuthStateChanged } from 'firebase/auth';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import NavMenuComponent from '$lib/components/NavMenuComponent.svelte';

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log(user);
      authStore.update((current) => {
        return { ...current, currentUser: user, isLoading: false };
      });

      // Check for authentication state and redirect if needed
      if (browser && !user && !authStore.isLoading && window.location.pathname === '/') {
        console.log(authStore.currentUser, authStore.isLoading);
        window.location.href = '/signin';
      }
    });

    return unsubscribe;
  });
</script>

{#if authStore.isLoading || !$authStore.currentUser}
  <div>Loading...</div>
{:else}
  <NavMenuComponent user={$authStore?.currentUser?.uid} />
  <slot />
{/if}