import { json } from "@sveltejs/kit";
import { firestore } from "$lib/firebase";
import { doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";

export async function DELETE({ request }) {
  const { postId, userId } = await request.json();

  if (!userId) {
    return json({ error: "Unauthorized." }, { status: 401 });
  }

  const postRef = doc(firestore, "posts", postId);
  const userRef = doc(firestore, "users", userId);

  try {
    await deleteDoc(postRef);
    await updateDoc(userRef, {
      posts: arrayRemove(postId),
    });

    return json({ message: "Post deleted and removed from user's posts array." });
  } catch (error) {
    return json({ error: "Failed to delete post." }, { status: 500 });
  }
}
