<script>
  export let user;
  export let isFollowing;

  // get auth
  import { auth } from '$lib/firebase';

  $: auth.currentUser = auth.currentUser;
</script>

<section class="user__bio">
  <img src="{user?.photoURL}" alt="Profile photo of {user?.displayName}" class="user__profileImg">
  <div class="user__wrapper">
    <div class="user__name">
      <h1 class="user__heading user__heading--name">{user?.displayName}</h1>
      {#if auth.currentUser && user?.uid == auth.currentUser.uid}
        <a href="/" class="user__edit user__heading">Edit profile</a>
      {:else if isFollowing}
          <button class="user__btn user__btn--unfollow">Unfollow <span class="user__x">x</span></button>
      {:else}
          <button class="user__btn user__btn--follow">Follow <span>+</span></button>
      {/if}
    </div>
    <div class="user__info">
      <ul class="user__list">
        <li class="user__listItem user__heading user__heading--posts">
          <a href="#user__posts" class="user__link user__link--posts">{user?.posts.length} Posts</a>
        </li>
        <li class="user__listItem user__heading user__heading--followers">
          <a href="/user/{user?.uid}/followers" class="user__link user__link--followers">{user?.followers.length} Followers</a>
        </li>
        <li class="user__listItem user__heading user__heading--following">
          <a href="/user/{user?.uid}/following" class="user__link user__link--following">{user?.following.length} Following</a>
        </li>
      </ul>
      <p class="user__description">{user?.description}</p>
    </div>
  </div>
</section>

<style>
  .user__bio {
    display: flex;
    justify-content: center;
    gap: 4.375rem;
    width: 100%;
    margin: 0 auto;
    border-bottom: solid 2px white;
    padding: 2rem 7rem;
    box-sizing: border-box;
  }

  .user__profileImg {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  .user__wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .user__name {
    display: flex;
    align-items: flex-end;
    gap: 1.5rem;
  }

  .user__heading {
    font-family: "Outfit", serif;
    color: white;
  }

  .user__heading--name {
    font-size: 3.25rem;
    font-weight: bold;
  }

  .user__edit {
    margin-bottom: 8px;
    font-weight: 600;
    text-decoration: none;
  }

  .user__list {
    display: flex;
    gap: 0.725rem;
  }

  .user__listItem {
    list-style: none;
  }

  .user__link {
    color: white;
    text-decoration: none;
    font-weight: 600;
  }

  .user__description {
    color: white;
    font-family: "Outfit", serif;
    font-size: 0.95rem;
    line-height: 1.3;
    width: 95%;
  }

  .user__info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
</style>