<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let post;
  export let userName;
  export let userPhoto;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  onMount(() => {
    console.log(post)
  })

  // convert the post.likeCount to a rounded number and add either a K or M if it's over 1000 but if its 0 dont show it
  if(post.likeCount == 0 || post.likeCount == undefined) {
    post.likeCount = '';
  }

  post.likeCount = post.likeCount > 999 ? post.likeCount > 999999 ? `${Math.round(post.likeCount / 1000000)}M` : `${Math.round(post.likeCount / 1000)}K` : post.likeCount;
</script>

<section class="modal">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal__bck" on:click={close}></div>
  <button on:click={close} class="modal__close">X Close</button>
  <div class="modal__wrapper">
    <button class="modal__user" on:click={close}>
      <a href="/user/{post.account}"><img src={userPhoto} alt={userName} class="modal__profileImg"/></a>
      <a href="/user/{post.account}">
        <h3 class="modal__profileName">{userName}</h3>
      </a>
    </button>
    <img src={post.path || post.imageUrl} alt={post.title} />
    <div class="modal__social">
      <div class="modal__btns">
      <div class="modal__share">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-share-2 modal__icon modal__icon--share"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
      </div>
      <div class="modal__likes">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart modal__icon modal__icon--like"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <span class="modal__likeNumber">{post.likeCount}</span>
      </div>
    </div>
    <h2 class="post__title">{post.title}</h2>
    <p class="post__description">{post.description || post.content}</p>
  </div>
</section>

<style>
  .modal {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 999999;
  }

  .modal__bck {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.83);
    z-index: -1;
  }

  .modal__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    font-size: 1rem;
    cursor: pointer;
  }

  .modal__wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 100%;
    max-width: 1150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .modal__user {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 1rem;
    background-color: transparent;
    border: none;
    text-decoration: none;
  }

  .modal__profileImg {
    width: 37px;
    height: 37px;
    border-radius: 50%;
  }

  .modal__profileName {
    color: white;
    font-family: "Outfit", serif;
    font-size: 1rem;
    font-weight: 500;
  }

  img {
    display: flex;
    width: 100%;
    object-fit: cover;
    align-self: center;
  }

  .post__title {
    display: none;
    color: white;
    font-family: "Outfit", serif;
    font-size: 1rem;
    margin: 1rem 0 0.4rem;
  }

  .modal__btns {
    display: flex;
    gap: 0.6rem;
    margin: 1rem 0 0.6rem;
  }

  .modal__icon {
    width: 20px;
    height: 20px;
  }

  .post__description {
    color: white;
    font-size: 0.85rem;
    font-family: "Outfit", serif;
    width: 65%;
    line-height: 1.2;
  }

  .modal__likes {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .modal__likeNumber {
    color: white;
    font-family: "Outfit", serif;
    font-size: 0.75rem;
  }
</style>