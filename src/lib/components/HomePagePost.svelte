<script>
  
  export let post;
</script>

<article class="homePost">
  <section class="homePost__userWrapper">
    <div class="homePost__user">
      <img src="{post.photoURL}" alt="profile icon of user" class="homePost__profileIcon">
      <p class="homePost__profileName">{post.displayName}</p>
    </div>
    <div class="homePost__settings">
      <span class="circle">*</span>
      <span class="circle">*</span>
      <span class="circle">*</span>
    </div>
  </section>
  <section class="homePost__content">
    <img src="{post.imageUrl}" alt="Post of {post.displayName} Titled: {post.title}" class="homePost__img">
    <div class="homePost__contentWrapper">
      <div class="homePost__social">
        <button class="homePost__share">
          <img src="/" alt="Share icon" class="homePost__icon homePost__icon--share">
        </button>
        <div class="homePost__likes">
          <button class="homePost__like">
            <img src="/" alt="Like Icon" class="homePost__icon homePost__icon--like">
            <span class="homePost__likeNumber">13k</span>
          </button>
        </div>
        <p class="homePost__game">{post.game.name}</p>
      </div>
      <div class="homePost__text">
        <h2 class="homePost__title homePost__text homePost__text--title">{post.title}</h2>
        <p class="homePost__description homePost__text homePost__text--description">{post.description}</p>
      </div>
    </div>
  </section>
  <span class="homePost__line"></span>
</article>