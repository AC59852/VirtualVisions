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

	return json({
		status: 200,
		body: users
	});
}
