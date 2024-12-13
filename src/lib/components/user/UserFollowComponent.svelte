<script>
  export let user;
</script>

<div class="follows__item">
  <a href="/user/{user.uid}" class="follows__photo">
    <img src="{user.photoURL}" alt="Profile photo for {user.displayName}" class="follows__img" />
  </a>
  <div class="follows__text">
    <div class="follows__name">
      <a href="/user/{user.uid}" class="follows__link">
        <h2 class="follows__heading">{user.displayName}</h2>
      </a>
      <button class="follows__following">Following <span class="follows__unfollow">X</span></button>
    </div>
    <ul class="follows__followerInfo">
      <li class="follows__listItem follows_listItem--post">
        <a href="/user/{user.uid}" class="follows__link follows__link--posts">{user.postsLength} Posts</a>
      </li>
      <li class="follows__listItem follows_listItem--followers">
        <a href="/user/{user.uid}/followers" class="follows__link follows__link--followers">{user.followersLength} Followers</a>
      </li>
      <li class="follows__listItem follows_listItem--following">
        <a href="/user/{user.uid}/following" class="follows__link follows__link--following">{user.followingLength} Following</a>
      </li>
    </ul>
    <p class="follows__description">{user.description}</p>
  </div>
</div>
<style>
  .follows__item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    font-family: "Outfit", serif;
    color: white;
    width: 100%;
    height: 150px;
  }

  .follows__photo {
    height: 90%;
    object-fit: cover;
  }

  .follows__img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .follows__text {
    display: flex;
    flex-direction: column;
  }

  .follows__name {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .follows__heading {
    font-size: 3.25rem;
    font-weight: bold;
  }

  .follows__following {
    background-color: transparent;
    color: white;
    font-family: "Outfit", serif;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }

  .follows__unfollow {
    font-size: 0.8rem;
    color: #ED6464;
    margin-left: 5px;
  }

  .follows__followerInfo {
    display: flex;
    gap: 0.625rem;
    margin-bottom: 0.625rem;
    margin-top: 1rem;
  }

  .follows__listItem {
    list-style: none;
  }

  .follows__link {
    color: white;
    font-size: 1.05rem;
    font-weight: 600;
    text-decoration: none;
  }
  
  .follows__description {
    font-size: 0.95rem;
    font-weight: 400;
    width: 75%;
    line-height: 120%;
  }
</style>