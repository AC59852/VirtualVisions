import { json } from '@sveltejs/kit';
import { firestore } from '$lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export async function PUT({ request }) {
  // Get the post ID from the request body
  const { postId } = await request.json();

  // Get the post document
  const postRef = doc(firestore, 'posts', postId);

  // Update the post's like count
  await updateDoc(postRef, {
    likeCount: increment(1),
  });

  return json({
    status: 200,
    body: { message: 'Post liked' },
  });
}
