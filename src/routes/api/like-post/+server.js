import { json } from '@sveltejs/kit';
import { firestore } from '$lib/firebase';
import { doc, updateDoc, increment, collection, setDoc, deleteDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export async function PUT({ request }) {
  const { postId, userId } = await request.json();

  if (!userId || !postId) {
    return json({ message: 'Bad Request: Missing postId or userId' }, { status: 400 });
  }

  // References to Firestore documents and sub-collection
  const postRef = doc(firestore, 'posts', postId);
  const likeRef = doc(collection(postRef, 'likes'), userId);
  const userRef = doc(firestore, 'users', userId);

  // Check if the like already exists
  const likeDoc = await getDoc(likeRef);
  const alreadyLiked = likeDoc.exists();

  if (alreadyLiked) {
    // If already liked, remove it from the likes sub-collection and decrement likeCount
    await deleteDoc(likeRef);
    await updateDoc(postRef, {
      likeCount: increment(-1),
    });

    await updateDoc(userRef, {
      likedPosts: arrayRemove(postId), // Remove the post ID from the likedPosts array
    });

    return json({ message: 'Post unliked', status: 200 });
  } else {
    // If not liked, add it to the likes sub-collection and increment likeCount
    await setDoc(likeRef, {
      userId: userId,
      likedAt: new Date().toISOString(),
    });
    await updateDoc(postRef, {
      likeCount: increment(1),
    });

    await updateDoc(userRef, {
      likedPosts: arrayUnion(postId), // Add the post ID to the likedPosts array
    });

    return json({ message: 'Post liked', status: 200 });
  }
}