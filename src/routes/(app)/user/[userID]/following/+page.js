import { auth } from "$lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export async function load({ params, fetch }) {
  // Wrap the logic in a promise to handle the asynchronous state resolution
  const data = await new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      console.log(user);
      const body = {
        uid: params.userID, // The target user's UID
        currentUid: user ? user.uid : null, // Authenticated user's UID if logged in
      };

      const res = await fetch('/api/user-following', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        resolve({ status: res.status, error: new Error('Data not found') });
      } else {
        const result = await res.json();

        console.log(result);

        resolve({ following: result.following });
      }
    });
  });

  return data;
}
