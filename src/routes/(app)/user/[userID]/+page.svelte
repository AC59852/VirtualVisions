<script>
  import { pushState } from '$app/navigation';
  import UserBioComponent from '$lib/components/user/UserBioComponent.svelte';
  import PostComponent from '$lib/components/user/PostComponent.svelte';
  export let data;

  let { user, posts, selectedPost } = data;

  async function openPost(post) {
    await pushState(`/user/${user.uid}/post/${post.id}`);
    selectedPost = post;
  }

  async function closeModal() {
    await pushState(`/user/${user.uid}`);
    selectedPost = null;
  }
</script>

<section class="user">
  {#if user}
    <UserBioComponent user={user} />
    <h2>All posts</h2>
    {#if posts.length > 0}
      <section class="posts">
        {#each posts as post}
          <a href="/user/{user.uid}/post/{post.id}"
            on:click={(e) => {
              e.preventDefault();
              openPost(post);
          }}>
              <PostComponent post={post} />
          </a>
        {/each}
      </section>
    {:else}
      <p>No posts</p>
    {/if}
  {:else}
    <h1>This user does not exist :(</h1>
  {/if}
</section>

{#if selectedPost}
  <div class="modal">
      <h1>{selectedPost.title}</h1>
      <p>{selectedPost.body}</p>
      <button on:click={closeModal}>Close</button>
  </div>
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
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
</style>