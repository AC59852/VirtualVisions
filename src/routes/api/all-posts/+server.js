import { json } from '@sveltejs/kit';
import { firestore, storage } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

export async function GET({}) {
	let data = [];
	try {
		const querySnapshot = await getDocs(collection(firestore, 'posts'));
		const items = [];

		for (const doc of querySnapshot.docs) {
			const item = doc.data();
			const imagePath = item.path;

			if (imagePath) {
				try {
					const imageRef = ref(storage, imagePath);
					const url = await getDownloadURL(imageRef);
					item.imageUrl = url;
				} catch (error) {
					console.error('Error fetching image URL:', error);
					item.imageUrl = '';
				}
			}

			items.push(item);
		}

		data = items; // Setting data will now trigger reactivity with $:
		console.log(data);
	} catch (error) {
		console.error('Error fetching:', error);
	}

	return json(data);
}
