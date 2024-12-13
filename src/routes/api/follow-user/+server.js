import { json } from '@sveltejs/kit';
import { firestore } from '$lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export async function POST({ request }) {
  try {
    const { uid, userToFollow } = await request.json();

    // Validate input
    if (!uid || !userToFollow) {
      return json({ message: 'Missing required fields' }, { status: 400 });
    }

    const userRef = doc(firestore, `users/${uid}`);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return json({ message: 'User not found' }, { status: 404 });
    }

    const userToFollowRef = doc(firestore, `users/${userToFollow}`);
    const user = userDoc.data();
    const following = user.following || [];

    if (following.some(follow => follow.id === userToFollowRef.id)) {
      // Unfollow the user
      await updateDoc(userRef, {
        following: arrayRemove(userToFollowRef),
      });
      return json({ message: 'User unfollowed successfully' }, { status: 200 });
    } else {
      // Follow the user
      await updateDoc(userRef, {
        following: arrayUnion(userToFollowRef),
      });
      return json({ message: 'User followed successfully' }, { status: 200 });
    }
  } catch (err) {
    console.error('Error updating following:', err);
    return json({ message: 'Internal server error' }, { status: 500 });
  }
}