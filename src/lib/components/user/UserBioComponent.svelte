<script>
  import { auth, firestore } from '$lib/firebase';
  import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
  import { onAuthStateChanged } from 'firebase/auth';
  import { onMount } from 'svelte';
  
  export let user;
  export let isFollowing;
  export let loggedInUser;

  let followerCount = user?.followers.length || 0;

  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await checkFollowStatus(user.uid);
      }
    });

    return unsubscribe;
  });

  async function checkFollowStatus(currentUserUid) {
    try {
      const userDoc = doc(firestore, 'users', currentUserUid);
      const userDocSnap = await getDoc(userDoc);

      if (userDocSnap.exists()) {
        const userDocData = userDocSnap.data();
        isFollowing = userDocData.following?.some((ref) => ref.id === user.uid) || false;
      }
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  }

  async function toggleFollow(uid) {
    try {
      const res = await fetch(`/api/follow-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid: loggedInUser.uid, userToFollow: uid })
      });

      if (res.ok) {
        const { followerCount: updatedCount } = await res.json();
        followerCount = updatedCount;
        isFollowing = !isFollowing;
      } else {
        console.error('Failed to toggle follow status');
      }
    } catch (err) {
      console.error('Error toggling follow status:', err);
    }
  }
</script>

<section class="user__bio">
  <img src="{user?.photoURL}" alt="Profile photo of {user?.displayName}" class="user__profileImg">
  <div class="user__wrapper">
    <div class="user__name">
      <h1 class="user__heading user__heading--name">{user?.displayName}</h1>
      {#if loggedInUser === null}
        <p>Loading...</p>
      {:else if loggedInUser && user?.uid === loggedInUser.uid}
        <a href="/" class="user__edit user__heading">Edit profile</a>
      {:else if loggedInUser}
        <button
          class="user__btn {isFollowing ? 'user__btn--unfollow' : 'user__btn--follow'}"
          on:click={() => toggleFollow(user.uid)}
        >
          {isFollowing ? 'Unfollow' : 'Follow'} <span>{isFollowing ? 'x' : '+'}</span>
        </button>
      {/if}
    </div>
    <div class="user__info">
      <ul class="user__list">
        <li class="user__listItem user__heading user__heading--posts">
          <a href="#user__posts" class="user__link user__link--posts">{user?.posts.length} Posts</a>
        </li>
        <li class="user__listItem user__heading user__heading--followers">
          <a href="/user/{user?.uid}/followers" class="user__link user__link--followers">{followerCount} Followers</a>
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
    align-items: center;
    gap: 4.375rem;
    width: 100%;
    margin: 0 auto;
    border-bottom: solid 2px white;
    padding: 2rem 4rem;
    box-sizing: border-box;
  }

  .user__profileImg {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
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
    width: 80%;
  }

  .user__info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @media screen and (max-width: 470px) {
    .user__bio {
      align-items: flex-start;
      gap: 1.1rem;
      padding: 1rem;
    }

    .user__profileImg {
      width: 95px;
      height: 95px;
    }

    .user__wrapper {
      width: auto;
      gap: 0.5rem;
    }

    .user__name {
      align-items: flex-start;
    }

    .user__heading--name {
      font-size: 1.6rem;
    }

    .user__btn {
      display: none;
    }

    .user__info {
      gap: 0.5rem;
    }

    .user__description {
      width: 100%;
    }
  }  
</style>