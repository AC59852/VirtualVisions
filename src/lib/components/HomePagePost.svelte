<script>
  import { auth } from '$lib/firebase';
  export let post;
  export let userLikes;

  async function likePost() {

    const user = await auth.currentUser

    await fetch('/api/like-post', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        postId: post.id,
        userId: user.uid,
       })
    })

    // if the post is liked, unlike it
    if (userLikes) {
      userLikes = false
    } else {
      userLikes = true
    }

    // update the like count
    post.likeCount = userLikes ? post.likeCount + 1 : post.likeCount - 1
  }
</script>

<article class="homePost">
  <section class="homePost__userWrapper">
    <a href="/user/{post.account}" class="homePost__user">
      <img src="{post.photoURL}" alt="profile icon of user" class="homePost__profileIcon">
      <p class="homePost__profileName">{post.displayName}</p>
    </a>
    <div class="homePost__settings">
      <span class="circle"></span>
      <span class="circle"></span>
      <span class="circle"></span>
    </div>
  </section>
  <section class="homePost__content">
    <img src="{post.imageUrl}" alt="Post of {post.displayName} Titled: {post.title}" class="homePost__img">
    <div class="homePost__contentWrapper">
      <div class="homePost__social">
        <div class="homePost__btns">
          <div class="homePost__share">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-share-2 homePost__icon homePost__icon--share"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </div>
          <button class="homePost__likes" on:click={likePost}>
            <svg xmlns="http://www.w3.org/2000/svg"
              width="24" height="24" viewBox="0 0 24 24" fill={userLikes ? 'white' : 'transparent'} stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart homePost__icon homePost__icon--like">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="homePost__likeNumber">{post.likeCount}</span>
          </button>
        </div>
        <p class="homePost__game">{post.game.name}</p>
      </div>
      <div class="homePost__text">
        <!-- <h2 class="homePost__title homePost__text homePost__text--title">{post.title}</h2> -->
        <p class="homePost__description homePost__text homePost__text--description">{post.description}</p>
      </div>
    </div>
  </section>
  <span class="homePost__line"></span>
</article>
<style>
  
  .homePost {
    width: 100%;
  }

  .homePost__userWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .homePost__user {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .homePost__profileIcon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .homePost__profileName {
    font-family: "Outfit", serif;
    font-optical-sizing: auto;
    font-size: 0.9rem;
    font-weight: 700;
    margin-left: 10px;
    color: white;
  }

  .homePost__settings {
    display: flex;
    align-items: center;
  }

  .circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #fff;
    margin-left: 0.2rem;
  }

  .homePost__img {
    width: 100%;
    height: 600px;
    object-fit: cover;
    object-position: center;
    margin: 15px 0;
  }

  .homePost__contentWrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .homePost__social {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .homePost__btns {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .homePost__icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .homePost__icon--share {
    width: 18px;
    height: 18px;
  }

  .homePost__likes {
    display: flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .homePost__likeNumber {
    font-family: "Outfit", serif;
    font-optical-sizing: auto;
    font-size: 0.8rem;
    font-weight: 700;
    color: white;
  }

  .homePost__game {
    font-family: "Outfit", serif;
    font-optical-sizing: auto;
    font-size: 0.8rem;
    font-weight: 500;
    color: #A1A1A1;
  }

  .homePost__text {
    margin: 8px 0;
  }

  /* .homePost__title {
    font-family: "Outfit", serif;
    font-optical-sizing: auto;
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
  } */

  .homePost__description {
    font-family: "Outfit", serif;
    font-optical-sizing: auto;
    font-size: 0.84rem;
    color: #fff;
    line-height: 1.4;
  }

  .homePost__line {
    display: block;
    width: 100%;
    height: 1px;
    background-color: #4E4E4E;
    margin: 33px 0;
  }

  @media screen and (max-width: 470px) {
		.homePost__userWrapper {
			padding: 0 10px;
		}

		.homePost__img {
			height: 280px;
		}

    .homePost__contentWrapper {
      padding: 0 7px;
    }
	}
</style>