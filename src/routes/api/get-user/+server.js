import { json } from "@sveltejs/kit";
import { firestore, storage } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST({request}) {
    const { uid } = await request.json();

    try {
        const userDoc = await getDoc(doc(firestore, 'users', uid));
        if (!userDoc.exists()) {
            return json({
                status: 404,
                body: { message: 'User not found' }
            });
        }

        return json({ 
            // return the user displayName, photoURL, and uid
            user: {
                displayName: userDoc.data().displayName,
                photoURL: userDoc.data().photoURL,
                uid,
                likedPosts: userDoc.data().likedPosts || []
            } 
        });
    }
    catch (e) {
        return json({
            status: 500,
            body: { message: e.message }
        });
    }
}