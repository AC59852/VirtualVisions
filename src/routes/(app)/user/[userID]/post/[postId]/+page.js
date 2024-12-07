import allGames from '$lib/games/all-games.json'; // Import the JSON file

export async function load({ params, fetch }) {
    const postID = params.postId;
    const userID = params.userID;
    let user;
    let game;

    const res = await fetch('/api/unique-user-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postID, userID }),
    });
  
    const data = await res.json();
    const selectedPost = postID
      ? data.posts.find((post) => post.id === postID) || null
      : null;

    user = {
      id: data.user.uid,
      name: data.user.displayName,
      image: data.user.photoURL
    }

    if (selectedPost) {
      game = allGames.find(game => game.id === selectedPost.game);
    }
  
    return {
      user: user,
      posts: data.posts,
      selectedPost,
      game
    };
  }