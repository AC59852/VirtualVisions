<script>
  export let data;

  export let { user, selectedPost, game } = data;

  // convert the selectedPost.likeCount to a rounded number and add either a K or M if it's over 1000
  selectedPost.likeCount = selectedPost.likeCount > 999 ? selectedPost.likeCount > 999999 ? `${Math.round(selectedPost.likeCount / 1000000)}M` : `${Math.round(selectedPost.likeCount / 1000)}K` : selectedPost.likeCount;

  // function to enlarge the image
  let isModalOpen = false;

  function enlargeImg() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }
</script>

<svelte:head>
	<title>Virtual Visions | {selectedPost?.title ? selectedPost.title : `${user?.name} | Photos` }</title>
	<meta name="description" content="{selectedPost.description ? selectedPost.description : "An amazing, high-quality post from someone just like yourself"}, only on Virtual Visions" />
	<meta property="og:title" content="Virtual Visions | {selectedPost?.title ? selectedPost.title : `${user?.name} | Photos` }" />
	<meta property="og:description" content="{selectedPost.description ? selectedPost.description : "An amazing, high-quality post from someone just like yourself"}, only on Virtual Visions" />
	<meta property="og:image" content="{selectedPost.imageUrl}" />
	<meta property="og:url" content="https://virtual-visions-red.vercel.app/explore" />
	<!-- twitter card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@virtualvisions" />
	<meta name="twitter:title" content="Virtual Visions | {selectedPost?.title ? selectedPost.title : `${user?.name} | Photos` }" />
	<meta name="twitter:description" content="{selectedPost.description ? selectedPost.description : "An amazing, high-quality post from someone just like yourself"}, only on Virtual Visions" />
	<meta name="twitter:image" content="{selectedPost.imageUrl}" />
	<!-- robots follow and index -->
	<meta name="robots" content="follow, index" />
</svelte:head>

<div class="pageWrapper">
  <article class="userPost">
    <section class="userPost__header">
      <a href="/user/{selectedPost.account}"><img src="{user.image}" alt="Profile image for the user {user.name}" class="userPost__profileImg"></a>
      <a href="/user/{selectedPost.account}">
        <h2 class="userPost__profileName">{user.name}</h2>
      </a>
    </section>
    <section class="userPost__post">
      <img src="{selectedPost.path || selectedPost.imageUrl}" alt="{selectedPost.title}" class="userPost__img">
      <div class="userPost__social">
        <div class="userPost__btns">
          <div class="userPost__share">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-share-2 userPost__icon userPost__icon--share"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </div>
          <div class="userPost__likes">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart userPost__icon userPost__icon--like"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span class="userPost__likeNumber">{selectedPost.likeCount}</span>
          </div>
        </div>
        <div>
          <button class="userPost__btn" on:click={enlargeImg}>Enlarge Image</button>
          <span class="userPost__game">{game.name}</span>
        </div>
      </div>
      <div class="userPost__content">
        {#if selectedPost.title}
          <h1 class="userPost__title">{selectedPost.title}</h1>
        {/if}
        {#if selectedPost.description}
          <p class="userPost__description">{selectedPost.description}</p>
        {/if}
        {#if selectedPost.content}
          <p class="userPost__description">{selectedPost.content}</p>
        {/if}
      </div>
    </section>
  </article>

  {#if isModalOpen}
    <div class="modal">
      <img src="{selectedPost.path || selectedPost.imageUrl}" alt="{selectedPost.title}" class="modal__img">
      <button class="modal__closeBtn" on:click={closeModal}>Close</button>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="overlay" on:click={closeModal}></div>
  {/if}
</div>
<style>
  .pageWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh; /* Use viewport height for centering */
    box-sizing: border-box;
  }
  
  .userPost {
    width: 100%;
    max-width: 1100px;
    margin-left: 5%;
    display: flex;
    flex-direction: column;
    margin-top: -20px;
    gap: 20px;
  }

  .userPost__header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .userPost__header a {
    text-decoration: none;
  }

  .userPost__profileImg {
    width: 47px;
    height: 47px;
    border-radius: 50%;
    object-fit: cover;
  }

  .userPost__profileName {
    font-family: "Outfit", serif;
    font-size: 1rem;
    font-weight: 500;
    color: white;
  }

  .userPost__post {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .userPost__img {
    width: 100%;
    max-height: 710px;
    object-fit: cover;
  }

  .userPost__social {
    display: flex;
    justify-content: space-between;
    margin: 3px 0 5px;
  }

  .userPost__btns {
    display: flex;
    gap: 10px;
  }

  .userPost__icon {
    width: 20px;
    height: 20px;
  }

  .userPost__likes {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .userPost__likeNumber {
    font-family: "Outfit", serif;
    font-size: 0.8rem;
    font-weight: 400;
    color: white;
  }

  .userPost__btn {
    font-family: "Outfit", serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: #A1A1A1;
    background: none;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }

  .userPost__game {
    font-family: "Outfit", serif;
    font-size: 0.8rem;
    font-weight: 400;
    color: #A1A1A1;
  }

  .userPost__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-family: "Outfit", serif;
    color: white;
  }

  .userPost__title {
    font-size: 1rem;
    font-weight: 600;
  }

  .userPost__description {
    font-size: 0.8rem;
    font-weight: 400;
    width: 60%;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 1500px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .modal__img {
    width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 5px;
    margin-left: 5%;
  }

  .modal__closeBtn {
    font-family: "Outfit", serif;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    background: #131313;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
    margin-left: 5%;
  }

  .modal__closeBtn:hover {
    background: #555;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
  }
</style>