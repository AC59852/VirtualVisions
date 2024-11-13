<script>
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';
	import { auth, firestore } from '$lib/firebase';
	import { collection, addDoc, arrayUnion, doc, updateDoc } from 'firebase/firestore';
	import { get } from 'svelte/store';
	import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

	onMount(() => {
		const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser) => {
			if (!firebaseUser || !get(user) || get(user).uid !== firebaseUser.uid) {
				location.href = '/login';
			} else {
				console.log('User is logged in:', firebaseUser);
			}
		});

		return () => unsubscribeAuth();
	});

	let games = [
		{ id: 'SrO15GjWJ2YxbBZeeZUd', game: "Marvel's Spider-Man" },
		{ id: 'wpvT4h5L3leDBqOtW2cp', game: "Assassin's Creed Odyssey" }
	];

	async function createPost(event) {
		event.preventDefault();

		const formData = new FormData(event.target);
		const imageFile = formData.get('image'); // Get the file object

		// Define the path for the image in the root folder
		const imagePath = `${get(user).uid}/${imageFile.name}`;

		// Upload the image to Firebase Storage
		const storage = getStorage();
		const storageRef = ref(storage, imagePath);
		await uploadBytes(storageRef, imageFile);

		// Retrieve the public download URL for the image
		const downloadURL = await getDownloadURL(storageRef);

		// Create a new post with the public download URL for the image
		const post = {
			game: formData.get('game'),
			title: formData.get('title'),
			content: formData.get('content'),
			imageUrl: downloadURL, // Save the public URL
			account: get(user).uid
		};

		// Add the post to Firestore
		const docRef = await addDoc(collection(firestore, 'posts'), post);
		console.log('Document written with ID:', docRef.id);

		// Update the user's post array in Firestore
		const userRef = doc(collection(firestore, 'users'), get(user).uid);
		await updateDoc(userRef, {
			posts: arrayUnion(docRef.id)
		});
	}

	function previewImage(event) {
		const output = document.getElementById('output');
		const file = event.target.files[0];

		if (file) {
			output.src = URL.createObjectURL(file);
			output.onload = () => URL.revokeObjectURL(output.src);
		}
	}
</script>

<h1>Test</h1>

<form on:submit={createPost}>
	<select name="game">
		{#each games as { id, game }}
			<option value={id}>{game}</option>
		{/each}
	</select>

	<input type="text" name="title" placeholder="Title" />
	<input type="text" name="content" placeholder="Content" />

	<input type="file" name="image" accept="image/*" on:change={previewImage} />

	<button type="submit">Submit</button>
</form>
<img id="output" alt="Preview" />
