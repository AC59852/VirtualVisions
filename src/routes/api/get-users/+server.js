import { json } from '@sveltejs/kit';
import { firestore } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function POST({ request }) {
	const searchTerm = await request.json();
	let search = searchTerm.search.toLowerCase();
	const usersRef = collection(firestore, 'users');
	const querySnapshot = await getDocs(usersRef);

	const users = querySnapshot.docs
		.map((doc) => ({ id: doc.uid, ...doc.data() }))
		.filter((user) => user.displayName && user.displayName.toLowerCase().includes(search));
	
		// add to the user a post count, followers count and following count
		users.forEach(user => {
			user.postsLength = user.posts?.length || 0;
			user.followersLength = user.followers?.length || 0;
			user.followingLength = user.following?.length || 0;
		});

	return json({
		status: 200,
		body: users
	});
}
