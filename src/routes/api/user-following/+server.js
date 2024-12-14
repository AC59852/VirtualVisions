import { json } from "@sveltejs/kit";
import { firestore } from "$lib/firebase";
import { doc, getDoc } from 'firebase/firestore';

export async function POST({ request }) {
  try {
    const userID = await request.json();

    // Get the user's document
    const userRef = doc(firestore, 'users', userID.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return json({ message: 'User not found' }, { status: 404 });
    }

    const user = userDoc.data();

    // Ensure 'following' is an array
    if (!user.following || !Array.isArray(user.following)) {
      return json({ message: 'Following list not found or invalid' }, { status: 404 });
    }

    // Fetch data for each following reference
    const followingData = await Promise.all(
      user.following.map(async (ref) => {
        const docSnap = await getDoc(ref); // Fetch the referenced document
        if (docSnap.exists()) {
          const data = docSnap.data();

          // Get lengths for posts, followers, and following arrays
          const postsLength = data.posts?.length || 0;
          const followersLength = data.followers?.length || 0;
          const followingLength = data.following?.length || 0;

          return {
            uid: data.uid,
            displayName: data.displayName,
            photoURL: data.photoURL,
            postsLength,
            followersLength,
            followingLength,
            description: data.description || "",
          };
        }
        return null; // Handle cases where the document does not exist
      })
    );

    // Filter out null entries for references that failed
    const resolvedFollowing = followingData.filter(Boolean);

    return json({ following: resolvedFollowing });
  } catch (err) {
    console.error(err);
    return json({ message: 'Failed to fetch user data' }, { status: 500 });
  }
}