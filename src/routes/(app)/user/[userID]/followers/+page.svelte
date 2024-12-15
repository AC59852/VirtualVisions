<script>
  import { page } from '$app/stores';
	import UserFollowComponent from '$lib/components/user/UserFollowComponent.svelte';
  export let data;

  let { followers } = data;
</script>

<svelte:head>
  <!-- don't index -->
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="follows followers">
  {#await followers}
    <p>Loading...</p>
  {:then followers}
    {#if followers.length === 0}
      <p>This user does not have any followers yet</p>
    {:else}
      <ul class="follows__list">
        {#each followers as user}
          <UserFollowComponent user={user} />
        {/each}
      </ul>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</section>

<style>
  .follows {
    display: flex;
		flex-direction: column;
		max-width: 750px;
		margin: 0 auto;
    padding-top: 5rem;
  }

  .follows__list {
    display: flex;
    flex-direction: column;
    gap: 5rem;
  }
</style>
