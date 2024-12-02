export async function load({ params, fetch }) {
  const userID = params.userID;
  const postID = params.postID || null;

  const res = await fetch('/api/unique-user-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID })
  });

  if (!res.ok) {
      return { status: res.status, error: new Error('User not found') };
  }

  const data = await res.json();
  let selectedPost = null;

  if (postID) {
      selectedPost = data.posts.find(post => post.id === postID) || null;
  }

  return {
      user: data.user,
      posts: data.posts,
      selectedPost
  };
}