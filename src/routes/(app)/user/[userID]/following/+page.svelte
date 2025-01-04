<script>
  import { page } from '$app/stores';
	import UserFollowComponent from '$lib/components/user/UserFollowComponent.svelte';
  export let data;

  let { following } = data;

  console.log(following)
</script>

<svelte:head>
  <!-- don't index -->
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="follows following">
  {#await following}
    <p>Loading...</p>
  {:then following}
    {#if following.length === 0}
      <p>This user is not following anybody yet</p>
    {:else}
      <ul class="follows__list">
        {#each following as user}
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
		max-width: 825px;
		margin: 0 auto;
    padding-top: 5rem;
  }

  .follows__list {
    display: flex;
    flex-direction: column;
    gap: 5rem;
  }
</style>
