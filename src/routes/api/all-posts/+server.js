import { json } from '@sveltejs/kit';
import { firestore } from '$lib/firebase';
import { collection, query, orderBy, limit, startAfter, getDocs, doc, getDoc } from 'firebase/firestore';

export async function POST({ request }) {
	const { lastVisible, limit: pageLimit = 15 } = await request.json();
	try {
		const postsRef = collection(firestore, 'posts');
		let postsQuery = query(postsRef, orderBy('createdAt', 'desc'), limit(pageLimit));

		if (lastVisible) {
			const docId = lastVisible.split('/').pop();

			const lastDocRef = doc(firestore, 'posts', docId);
			const lastDocSnapshot = await getDoc(lastDocRef);

			if (lastDocSnapshot.exists()) {
				postsQuery = query(postsRef, orderBy('createdAt', 'desc'), startAfter(lastDocSnapshot), limit(pageLimit));
			} else {
				console.log('No more posts to load.');
				return json({ posts: [], lastVisible: null });
			}
		}

		const snapshot = await getDocs(postsQuery);
		if (snapshot.empty) {
			console.log('No more posts available.');
			return json({ posts: [], lastVisible: null });
		}

		// Fetch posts and their user details
		const posts = await Promise.all(snapshot.docs.map(async (postDoc) => {
			const postData = postDoc.data();
			const userRef = doc(firestore, 'users', postData.account); // Assuming `account` is the user ID
			const userSnapshot = await getDoc(userRef);

			return {
				id: postDoc.id,
				...postData,
				userName: userSnapshot.exists() ? userSnapshot.data().displayName : 'Unknown',
				userPhoto: userSnapshot.exists() ? userSnapshot.data().photoURL : '/default-avatar.png',
			};
		}));

		const lastDoc = snapshot.docs[snapshot.docs.length - 1];

		return json({
			posts,
			lastVisible: lastDoc ? lastDoc.ref.path : null,
		});
	} catch (error) {
		console.error('Error fetching posts:', error);
		return json({ error: 'Failed to fetch posts.' }, { status: 500 });
	}
}
