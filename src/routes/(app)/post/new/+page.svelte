<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/user';
	import { auth, firestore } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { collection, addDoc, arrayUnion, doc, updateDoc } from 'firebase/firestore';
	import { get } from 'svelte/store';
	import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import allGames from '$lib/games/all-games.json';
	let games = allGames;

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				console.log("test")
			}
		});
	});

	async function createPost(event) {
		event.preventDefault();

		console.log(authStore.currentUser);

		const formData = new FormData(event.target);
		const imageFile = formData.get('image'); // Get the file object

		console.log("form data:", {
			game: formData.get('game'),
			title: formData.get('title'),
			content: formData.get('description'),
			image: imageFile
		})

		// Define the path for the image in the root folder
		const imagePath = `${get(authStore.currentUser).uid}/${imageFile.name}`;

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
			description: formData.get('description'),
			path: downloadURL, // Save the public URL
			account: get(authStore.currentUser).uid,
			createdAt: new Date().toISOString()
		};

		// Add the post to Firestore
		const postRef = await addDoc(collection(firestore, 'posts'), post);
		console.log('Document written with ID:', postRef.id);

		// Update the user's post array in Firestore
		const userRef = doc(collection(firestore, 'users'), get(authStore.currentUser).uid);
		await updateDoc(userRef, {
			posts: arrayUnion(postRef)
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

<svelte:head>
	<title>Virtual Visions | New Post</title>
	<meta name="description" content="Create a new high-quality post on Virtual Visions, sharing your creativity and vast experiences with an amazing community." />
	<meta property="og:title" content="Virtual Visions | New Post" />
	<meta property="og:description" content="Create a new high-quality post on Virtual Visions, sharing your creativity and vast experiences with an amazing community." />
	<meta property="og:image" content="/vv-logo.png" />
	<meta property="og:url" content="https://virtual-visions-red.vercel.app/app/post/new" />
	<!-- twitter card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@virtualvisions" />
	<meta name="twitter:creator" content="@virtualvisions" />
	<meta name="twitter:title" content="Virtual Visions | New Post" />
	<meta name="twitter:description" content="Create a new high-quality post on Virtual Visions, sharing your creativity and vast experiences with an amazing community." />
	<meta name="twitter:image" content="/vv-logo.png" />
	<!-- robots -->
	<meta name="robots" content="index, follow" />
</svelte:head>

<form on:submit={createPost}>
	<select name="game">
		{#each games as game}
			<option value={game.id}>{game.name}</option>
		{/each}
	</select>

	<input type="text" name="title" placeholder="Title" />
	<textarea type="text" name="description" placeholder="Description" />

	<input type="file" name="image" accept="image/*" on:change={previewImage} />

	<button type="submit">Submit</button>
</form>
<img id="output" alt="Preview" class="post__preview" />
<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		width: 500px;
		margin: 0 auto;
	}

	.post__preview {
		width: 200px;
		display: flex;
		margin: 0 auto;
	}
</style>
