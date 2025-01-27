import { json } from '@sveltejs/kit';
import { firestore } from '$lib/firebase';
import { collection, query, orderBy, limit, startAfter, getDocs, doc, getDoc } from 'firebase/firestore';

export async function POST({ request }) {
	const { lastVisible, limit: pageLimit = 15 } = await request.json();

	console.log("Received lastVisible:", lastVisible); // Log the passed lastVisible value

	try {
			const postsRef = collection(firestore, 'posts');
			let postsQuery = query(postsRef, orderBy('createdAt', 'desc'), limit(pageLimit));

			// If `lastVisible` is passed, extract the document ID and create DocumentReference
			if (lastVisible) {
					const docId = lastVisible.split('/').pop(); // Extract the document ID

					console.log("Extracted docId:", docId); // Log the extracted docId

					// Get the DocumentReference using the extracted docId
					const lastDocRef = doc(firestore, 'posts', docId);

					// Now we get the DocumentSnapshot for that reference
					const lastDocSnapshot = await getDoc(lastDocRef);
					
					// If the document exists, use it for pagination
					if (lastDocSnapshot.exists()) {
							console.log("Found last document:", lastDocSnapshot.data()); // Log the data of the last document

							// Apply startAfter with the snapshot (not DocumentReference)
							postsQuery = query(postsRef, orderBy('createdAt', 'desc'), startAfter(lastDocSnapshot), limit(pageLimit));
					} else {
							console.log('No more posts to load.');
							return json({ posts: [], lastVisible: null }); // Return empty posts and lastVisible null
					}
			}

			// Fetch the posts
			const snapshot = await getDocs(postsQuery);

			// If snapshot is empty, return an empty list and set lastVisible to null
			if (snapshot.empty) {
					console.log('No more posts available.');
					return json({ posts: [], lastVisible: null }); // No more posts, return lastVisible null
			}

			const posts = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
			}));

			// Get the last document for pagination
			const lastDoc = snapshot.docs[snapshot.docs.length - 1];

			console.log("Last document fetched:", lastDoc.data()); // Log the last fetched document

			// Send the posts and the next lastVisible doc path for pagination
			return json({
					posts,
					lastVisible: lastDoc ? lastDoc.ref.path : null, // Make sure lastVisible is the path, not the ref itself
			});
	} catch (error) {
			console.error('Error fetching posts:', error);
			return json({ error: 'Failed to fetch posts.' }, { status: 500 });
	}
}
