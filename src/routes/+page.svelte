<script>
  import { databases, storage } from '$lib/appwrite';
  import { Query } from 'appwrite';
  import { user } from '$lib/user';

  let loggedInUser = null;
  let posts = [];

  // Subscribe to changes in the user store
  user.subscribe(value => {  
      if (value !== null) {
        console.log('user: ', value.$id);
        let promise = databases.listDocuments(
        "vv-db",
        "vv-users",
        [
          Query.equal('uid', value.$id)
        ]
      );

      promise.then((response) => {
        console.log('user found: ', response.documents[0]);
        loggedInUser = response.documents[0];

        getDocuments();
      });
      }
  });

  const getDocuments = async () => {
      let promise = databases.listDocuments(
        "vv-db",
        "vv-posts"
      );

      promise.then((response) => {
        response.documents.forEach((doc) => {
          const image = storage.getFilePreview('66031101cea7d9bdc9fb', doc.image, 400, 400)

          posts.push({
            user: doc.user,
            content: doc.description,
            image: image.href
          });

          posts = [...posts];

          console.log('posts: ', posts);
        })
      });
  };

  const login = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      await user.login(formData.get('email'), formData.get('password'))
  };

  const register = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      await user.register(formData.get('email'), formData.get('password'), formData.get('name'));
  };
</script>

<h1>Login or register</h1>

{#if loggedInUser !== null}
<!-- hello user.name -->
  <p>Hello {loggedInUser.name}</p>
  <section class="posts">
    <h2>Posts</h2>
    <ul>
      {#each posts as post}
        <li>
          <h3>{post.user.name}</h3>
          <img src={post.image} alt={post.title} />
          <p>{post.content}</p>
        </li>
      {/each}
    </ul>
  </section>
  <button on:click={user.logout}>Logout</button>
{:else}
  <form on:submit={login}>
      <label>
          Email
          <input type="email" placeholder="Email" name="email" required />
      </label>
      <label>
          Password:
          <input type="password" placeholder="Password" name="password" required />
      </label>
      <button type="submit"> Login </button>
  </form>
  
  <form on:submit={register}>
      <label>
          Name:
          <input type="text" placeholder="Name" name="name" required />
      </label>
      <label>
          Email:
          <input type="email" placeholder="Email" name="email" required />
      </label>
      <label>
          Password:
          <input type="password" placeholder="Password" name="password" required minlength="8" />
      </label>
      <button type="submit"> Register </button>
  </form>
{/if}

<style>
  form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
      margin-block-end: 2rem;
  }
</style>