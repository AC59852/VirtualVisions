<script>
  import { onDestroy } from 'svelte';
  import { pushState } from '$app/navigation';
  import UserBioComponent from '$lib/components/user/UserBioComponent.svelte';
  import PostComponent from '$lib/components/user/PostComponent.svelte';
	import PostModal from '$lib/components/user/PostModal.svelte';
  export let data;

  let { user, posts, selectedPost, loggedInUser } = data;

  async function openModal(post) {
    pushState(`/user/${user.uid}/post/${post.id}`);
    selectedPost = post;
  }

  async function closeModal() {
    pushState(`/user/${user.uid}`);
    selectedPost = null;
  }

  // Reactively update state when `data` changes (e.g., new `user`, `posts`, etc.)
  $: ({ user, posts, selectedPost, loggedInUser } = data);

  $: console.log('User:', loggedInUser);

  // Cleanup modal on destruction
  onDestroy(() => {
    selectedPost = null;
  });
</script>

<svelte:head>
  <title>Virtual Visions | {user?.displayName}</title>
  <meta name="description" content="View all of {user?.displayName}s incredible posts on Virtual Visions, gaining a sense of creativity and newfound appreciation for your favourite and even new games." />
  <meta property="og:title" content="Virtual Visions | {user?.displayName}" />
	<meta property="og:description" content="View all of {user?.displayName}s incredible posts on Virtual Visions, gaining a sense of creativity and newfound appreciation for your favourite and even new games." />
	<meta property="og:image" content="{user?.photoURL}" />
  <meta property="og:image:width" content="400" />
  <meta property="og:image:height" content="400" />
	<meta property="og:url" content="https://virtual-visions-red.vercel.app/user/{user.uid}" />
	<!-- twitter card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@virtualvisions" />
	<meta name="twitter:creator" content="@virtualvisions" />
	<meta name="twitter:title" content="Virtual Visions | {user?.displayName}" />
	<meta name="twitter:description" content="View all of {user?.displayName}s incredible posts on Virtual Visions, gaining a sense of creativity and newfound appreciation for your favourite and even new games." />
	<meta name="twitter:image" content="{user?.photoURL}" />
	<!-- robots -->
	<meta name="robots" content="index, follow" />
</svelte:head>

<section class="user">
  {#if user}
    <UserBioComponent user={user} loggedInUser={loggedInUser} />
    <h2 style="display: none;">All posts</h2>
    {#if posts.length > 0}
      <section class="posts">
        {#each posts as post}
          <a href="/user/{user.uid}/post/{post.id}"
            on:click={(e) => {
              e.preventDefault();
              openModal(post);
          }}>
              <PostComponent post={post} />
          </a>
        {/each}
      </section>
    {:else}
    <div class="loading loading--explore">
      <p>Looks like you haven't posted anything yet. Start <a href="/post/new">Creating</a> great content for other users to enjoy.</p>
      <!-- You can replace this with a spinner or animated loader -->
    </div>
    {/if}
  {:else}
    <h1>This user does not exist :(</h1>
  {/if}
</section>

{#if selectedPost}
  <PostModal 
    post={selectedPost} 
    on:close={closeModal} 
    userName={user?.displayName} 
    userPhoto={user?.photoURL}
    userUid={user?.uid}
  />
{/if}

<style>
  .user {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 939px;
  }

  .posts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    gap: 4px;
    margin-top: 30px;
  }

  .loading--explore {
		align-items: flex-start;
		line-height: 1.4;
		text-align: center;
		font-size: 1.8rem;
		font-weight: 500;
    color: white;
    font-family: "Outfit", sans-serif;
    width: 80%;
    margin: 2rem auto 0;
	}

	.loading--explore a {
		color: white;
		text-decoration: none;
		border-bottom: 3px solid white;
		position: relative;
		display: inline-flex;
		overflow: hidden;
		transition: color 0.6s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.loading--explore a::after {
		position: absolute;
		content: "";
		width: 100%;
		height: 100%;
		bottom: 0;
		left: 0;
		background-color: white;
		transform: translateY(100%);
		transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
		z-index: -1;
	}

	.loading--explore a:hover {
  	color: black; /* Text color changes to black */
	}

	.loading--explore a:hover::after {
		transform: translateY(0);
		color: black;
	}
</style>