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
    const userToFollowRef = doc(firestore, `users/${userToFollow}`);

    // Fetch both user documents
    const [userDoc, userToFollowDoc] = await Promise.all([
      getDoc(userRef),
      getDoc(userToFollowRef)
    ]);

    if (!userDoc.exists()) {
      return json({ message: 'User not found' }, { status: 404 });
    }

    if (!userToFollowDoc.exists()) {
      return json({ message: 'User to follow not found' }, { status: 404 });
    }

    const user = userDoc.data();
    const following = user.following || [];
    const userToFollowData = userToFollowDoc.data();
    const currentFollowerCount = (userToFollowData.followers || []).length;

    let updatedFollowerCount;

    if (following.some(follow => follow.id === userToFollowRef.id)) {
      // Unfollow the user
      await Promise.all([
        updateDoc(userRef, {
          following: arrayRemove(userToFollowRef),
        }),
        updateDoc(userToFollowRef, {
          followers: arrayRemove(userRef),
        })
      ]);

      updatedFollowerCount = currentFollowerCount - 1;

      return json({ 
        message: 'User unfollowed successfully', 
        followerCount: updatedFollowerCount 
      }, { status: 200 });
    } else {
      // Follow the user
      await Promise.all([
        updateDoc(userRef, {
          following: arrayUnion(userToFollowRef),
        }),
        updateDoc(userToFollowRef, {
          followers: arrayUnion(userRef),
        })
      ]);

      updatedFollowerCount = currentFollowerCount + 1;

      return json({ 
        message: 'User followed successfully', 
        followerCount: updatedFollowerCount 
      }, { status: 200 });
    }
  } catch (err) {
    console.error('Error updating following and followers:', err);
    return json({ message: 'Internal server error' }, { status: 500 });
  }
}
