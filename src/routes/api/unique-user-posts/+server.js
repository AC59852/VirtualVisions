import { firestore } from '$lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export async function POST({ request }) {
    try {
        const { userID } = await request.json();

        if (!userID) {
            return new Response(
                JSON.stringify({ error: 'User ID is required.' }),
                { status: 400 }
            );
        }

        // Fetch the user data
        const userRef = doc(firestore, 'users', userID);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return new Response(
                JSON.stringify({ error: 'User not found.' }),
                { status: 404 }
            );
        }

        const userData = userSnap.data();

        // Fetch the user's posts
        const postsCollection = collection(firestore, 'posts');
        const postsQuery = query(postsCollection, where('account', '==', userID));
        const postsSnap = await getDocs(postsQuery);

        const posts = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return new Response(
            JSON.stringify({ user: userData, posts }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch user data or posts.' }),
            { status: 500 }
        );
    }
}