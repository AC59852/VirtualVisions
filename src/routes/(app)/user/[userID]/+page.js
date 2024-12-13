import { auth } from '$lib/firebase';

export async function load({ params, fetch }) {
    const userID = params.userID;
    const postID = params.postID || null;
  
    const res = await fetch('/api/unique-user-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID }),
    });
  
    if (!res.ok) {
      throw new Error('User not found');
    }
  
    const data = await res.json();
    const selectedPost = postID
      ? data.posts.find((post) => post.id === postID) || null
      : null;
  
    // Explicitly set loggedInUser to null initially
    const loggedInUser = (await loggedInUserFunction()) || null;

    async function loggedInUserFunction() {
        return new Promise((resolve) => {
          const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            const loggedInUserData = currentUser
              ? { uid: currentUser.uid }
              : null;
            unsubscribe();
            resolve(loggedInUserData); // Resolve with the user data
          });
        });
    }

    console.log(data.user)
  
    return {
      user: data.user,
      posts: data.posts,
      selectedPost,
      loggedInUser,
    };
  }