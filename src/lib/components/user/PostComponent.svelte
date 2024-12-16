<script>
  export let post;
</script>
<div class="post__wrapper">
  <img class="post__img" src="{post.path || post.imageUrl}" alt="">
</div>
<style>
  .post__wrapper {
    width: 100%;
    padding-bottom: 100%;
    position: relative;
  }

  .post__wrapper::after {
    content: "";
    padding-bottom: 100%;
  }

  .post__img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    background-color: #181818;
  }
</style>