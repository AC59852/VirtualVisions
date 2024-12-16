<script>
	import Svelecte from 'svelecte';
	import { onMount } from 'svelte';
	import { auth, firestore } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { collection, addDoc, arrayUnion, doc, updateDoc, getDoc } from 'firebase/firestore';
	import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import allGames from '$lib/games/all-games.json';
	import { goto } from '$app/navigation';
	
	let userData;
	let currentGame;
	let output;

	let title = '';
	let description = '';

	onMount(() => {
		getUser()
	});

	async function getUser() {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				await getDoc(doc(firestore, 'users', user.uid))
					.then((doc) => {
						if (doc.exists()) {
							// set the user to user.displayName and user.photoURL
							let data = doc.data();
							userData = {
								displayName: data.displayName,
								photoURL: data.photoURL,
								uid: user.uid
							};
						} else {
							console.log('No such document!');
						}
					})
					.catch((error) => {
						console.log('Error getting document:', error);
					});
			}
		});
	}

	async function createPost(event) {
		event.preventDefault();

		const formData = new FormData(event.target);
		const imageFile = formData.get('image'); // Get the file object

		// if title is Preview Title, set it to empty
		if (title === 'Preview Title') {
			title = '';
		}

		// if description is Preview Description, set it to empty
		if (description === 'Preview Description...') {
			description = '';
		}

		if (!imageFile) {
			alert('Please select an image to upload.');
			return;
		}

		// Define the path for the image in the root folder
		const imagePath = `${userData.uid}/${imageFile.name}`;

		// Upload the image to Firebase Storage
		const storage = getStorage();
		const storageRef = ref(storage, imagePath);
		await uploadBytes(storageRef, imageFile);

		// Retrieve the public download URL for the image
		const downloadURL = await getDownloadURL(storageRef);

		// Create a new post with the public download URL for the image
		const post = {
			game: currentGame.id,
			title: formData.get('title'),
			description: formData.get('description'),
			path: downloadURL, // Save the public URL
			account: userData.uid,
			createdAt: new Date().toISOString(),
			likeCount: 0,
		};

		// Add the post to Firestore
		const postRef = await addDoc(collection(firestore, 'posts'), post);
		console.log('Document written with ID:', postRef.id);

		const likesRef = collection(postRef, 'likes');
    await addDoc(likesRef, {
        placeholder: true // This is optional, you can leave the collection empty initially
    });

		// Update the user's post array in Firestore
		const userRef = doc(firestore, 'users', userData.uid);
		await updateDoc(userRef, {
			posts: arrayUnion(postRef)
		});

		// Redirect the user to the new post
		goto(`/user/${userData.uid}/post/${postRef.id}`);
	}

	function previewImage(event) {
		output = document.getElementById('output');
		const file = event.target.files[0];

		if (file) {
			output.src = URL.createObjectURL(file);
			output.onload = () => URL.revokeObjectURL(output.src);
		}
	}

	function gameListHandler(event) {
		event.preventDefault(); // Prevent default form submission or route change

		const game = event.detail; // The selected game from Svelecte

		currentGame = game;

		console.log("current game:", currentGame);
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

<section class="post">
	<h1 class="post__title">Create a New Post</h1>
	<form on:submit={createPost} class="form">
		<aside class="form__preview">
			{#if userData}
				<header class="form__user">
					<img src={userData?.photoURL} alt="User profile" />
					<h2>{userData?.displayName}</h2>
				</header>
				<div class="form__imgContainer">
					<label for="file">
						<img id="output" alt="Preview" class="post__preview" style="{output?.src ? 'cursor: pointer;' : ''}" />
						{#if !output?.src}
							<div class="form__previewSelect">
								<p class="form__previewName">Preview Photo</p>
								<button class="form__previewBtn" type="button" for="file" on:click={() => {
									document.getElementById('file').click();
								}}>Choose File</button>
							</div>	
						{/if}
					</label>
					<input type="file" id="file" name="image" accept="image/*" on:change={previewImage} required hidden />
					<h2 class="form__previewTitle">{title ? title : 'Preview Title'}</h2>
					<p class="form__previewDesc">{description ? description : 'Preview Description...'}</p>
				</div>
			{/if}
		</aside>
		<section class="form__main">
			<div class="form__wrapper">
				<label for="games">Game:</label>
				<Svelecte
					options={allGames}
					on:change={gameListHandler}
					bind:selected={currentGame}
					placeholder="Choose a Game"
					class="svelecte-control dropdown-up"
					resetOnBlur={true}
					id="games"
					required
					/>
			</div>
			<div class="form__wrapper">
				<label for="title">Title (Optional):</label>
				<input type="text" id="title" name="title" placeholder="Title" maxlength="30" class="form__wrapperInput" bind:value={title} />
			</div>
			<div class="form__wrapper">
				<label for="description">Description (Optional):</label>
				<textarea type="text" name="description" placeholder="Description" class="form__wrapperInput" maxlength="200" cols="50" rows="8" bind:value={description} />
			</div>
	
			<button type="submit" class="form__postBtn">Post</button>
		</section>
	</form>
</section>
<style>

	.post {
		position: absolute;
		top: 46%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-family: "Outfit", sans-serif;
		color: white;
		width: 800px;
	}

	.post__title {
		font-size: 3rem;
		font-weight: bold;
		margin-bottom: 4rem;
		margin-left: -8.5rem;
	}

	.form {
		display: flex;
		gap: 4rem;
		justify-content: center;
		margin: 0 auto;
		width: 100%;
	}

	.form__imgContainer {
		position: relative;
	}

	.post__preview {
		width: 100%;
		display: flex;
		margin: 0 auto;
		position: relative;
		background: #D9D9D9;
		object-fit: cover;
		height: 400px;
		object-position: center;
	}

	.post__preview::after {
		content: '';
		padding-bottom: 100%;
		display: block;
	}

	.form__preview {
		width: 75%;
		flex: 1 0 auto;
	}

	.form__main {
		width: 50%;
	}

	.form__user {
		display: flex;
		width: 100%;
		gap: 1rem;
		align-items: center;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.form__user img {
		width: 46px;
		height: 46px;
		border-radius: 50%;
	}

	.form__previewSelect {
		position: absolute;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		color: black;
		font-size: 1.5rem;
		font-weight: 600;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.form__previewBtn {
		background: #4F4F4F;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		cursor: pointer;
		font-family: "Outfit", sans-serif;
		font-size: 1rem;
		transition: background 0.1s ease-in-out;
	}

	.form__previewBtn:hover {
		background: rgb(109, 109, 109);
	}

	.form__main {
		display: flex;
		flex-direction: column;
		gap: 1.6rem;
		align-self: center;
	}

	.form__wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 9px;
	}

	.form__wrapper label {
		font-size: 0.9rem;
		font-weight: 500;
	}

	.form__wrapperInput {
		color: black;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		font-family: "Outfit", sans-serif;
		font-size: 1rem;
	}

	.form__postBtn {
		background: #4F4F4F;
		color: white;
		border: none;
		padding: 0.8rem 1rem;
		border-radius: 5px;
		cursor: pointer;
		font-family: "Outfit", sans-serif;
		font-size: 1rem;
		transition: background 0.1s ease-in-out;
		margin-top: auto;
		width: 100%;
		margin-left: auto;
	}

	.form__postBtn:hover {
		background: rgb(109, 109, 109);
	}

	.form__previewTitle {
		font-size: 1rem;
		font-weight: 500;
		margin-top: 1rem;
	}

	.form__previewDesc {
		font-size: 0.9rem;
		font-weight: 500;
		margin-top: 0.5rem;
		word-wrap: break-word;
	}

	:global(.svelecte-control) {
    --sv-color: white;
    --sv-dropdown-bg: #181818;
    --sv-placeholder-color: black;
    --sv-dropdown-height: 180px;
    --sv-dropdown-active-bg: #353535;
		--sv-min-height: 40px;
    width: 100%;
    border: none;
    opacity: 1;
    font-family: "Outfit", sans-serif;
    cursor: pointer;
  }

	:global(.sv-input--text) {
    color: vlack;
    opacity: 1;
  }

	:global(.sv-control .sv-item--content) {
		color: black;
		overflow: visible;
	}

	:global(.sv-item--content) {
		overflow: visible !important;
	}
</style>
