<script>
	import { auth, firestore } from '$lib/firebase';
	import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
	import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	// Generic sign-in function
	async function signInWithProvider(provider) {
		const defaultFollowingRef = doc(firestore, 'users', 'ZBm9Av4V0PfbT0vrK7IZz2vGpJo2');
		
		try {
			// Sign in with the provided auth provider
			await signInWithPopup(auth, provider);

			// Create or fetch user profile
			const userRef = doc(firestore, 'users', auth.currentUser.uid);
			const docSnap = await getDoc(userRef);

			if (docSnap.exists()) {

				// if docSnap.data().isOnboarded is false, redirect to onboarding
				if (!docSnap.data().isOnboarded) {
					goto('/onboarding');
				} else {
					goto('/');
				}
			} else {
				// Create new user document
				await setDoc(userRef, {
					displayName: auth.currentUser.displayName,
					description: '',
					email: auth.currentUser.email,
					followers: [],
					following: [defaultFollowingRef],
					games: [],
					isOnboarded: false,
					photoURL: '',
					uid: auth.currentUser.uid,
					posts: [],
					createdAt: new Date().toISOString(),
				});

				// Create sub-collections
				const followersRef = collection(firestore, `users/${auth.currentUser.uid}/followers`);
				const followingRef = collection(firestore, `users/${auth.currentUser.uid}/following`);

				await addDoc(followersRef, { placeholder: true }); // Optional
				await addDoc(followingRef, { placeholder: true }); // Optional

				goto('/onboarding');
			}
		} catch (e) {
			console.error("Error during sign-in: ", e);
		}
	}

	// Functions for specific providers
	function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		signInWithProvider(provider);
	}

	function signInWithFacebook() {
		const provider = new FacebookAuthProvider();
    provider.addScope('public_profile'); 
		signInWithProvider(provider);
	}

	function notSetup() {
		alert("This login option is not available yet.");
	}
</script>

<svelte:head>
	<title>Virtual Visions | Login</title>
	<meta name="description" content="Virtual Visions is a social media platform for gamers to share their experiences and connect with others by uploading beautiful images from your favourite games and allowing others to view and marvel at your content" />
	<meta name="keywords" content="gaming, social media, images, sharing, community, friends, games, virtual visions" />
	<meta name="author" content="Virtual Visions" />
	<meta name="robots" content="index, follow" />
	<!-- open graph -->
	<meta property="og:title" content="Virtual Visions | Login" />
	<meta property="og:description" content="Virtual Visions is a social media platform for gamers to share their experiences and connect with others by uploading beautiful images from your favourite games and allowing others to view and marvel at your content" />
	<meta property="og:image" content="/vv-logo.png" />
	<meta property="og:url" content="https://virtual-visions-red.vercel.app/signin" />
</svelte:head>
<section class="login__form">

	<div class="login__wrapper">
	<h1 class="login__heading">Virtual Visions</h1>
	<div class="login__btnWrapper">
			<h2 class="login__heading login__heading--small">Login</h2>
			<div class="login__btns">
				<button on:click={signInWithGoogle} class="login__btn login__btn--google">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" class="login__icon login__icon--google"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>
				</button>
				<button on:click={signInWithFacebook} class="login__btn login__btn--fb">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="login__icon login__icon--fb"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/></svg>
				</button>
				<button on:click={notSetup} class="login__btn login__btn--fb">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
				</button>
				<button on:click={notSetup} class="login__btn login__btn--fb">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"/></svg>
				</button>
			</div>
		</div>
	</div>
</section>
<style>
  .login__form {
		display: flex;
		flex-direction: column;
		background: rgba(24, 24, 24, 0.7);
		backdrop-filter: blur(4.2px);
		-webkit-backdrop-filter: blur(4.2px);
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 1.2rem 2rem;
		box-sizing: border-box;
		width: 620px;
		height: 690px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
  }

	.login__wrapper {
		position: relative;
		height: 100%;
	}

  .login__heading {
		font-size: 4rem;
		font-family: "Outfit", sans-serif;
		font-weight: bold;
		color: white;
		margin-top: 2rem;
		text-align: center;
  }

	.login__heading--small {
		font-size: 2.1rem;
		text-align: left;
		margin-top: 0;
		margin-left: 10px;
		margin-bottom: 1.5rem;
	}

  .login__btnWrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
  }

	.login__btns {
		display: flex;
		justify-content: flex-start;
    gap: 30px;
	}

  .login__btn {
		width: 80px;
		fill: white;
		background-color: transparent;
		border: none;
		cursor: pointer;
  }
</style>

