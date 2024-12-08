<script>
	import { auth, firestore } from '$lib/firebase';
	import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
	import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	// Generic sign-in function
	async function signInWithProvider(provider) {
		try {
			// Sign in with the provided auth provider
			await signInWithPopup(auth, provider);

			// Create or fetch user profile
			const userRef = doc(firestore, 'users', auth.currentUser.uid);
			const docSnap = await getDoc(userRef);

			if (docSnap.exists()) {
				console.log("User data: ", docSnap.data());
				goto('/');
			} else {
				// Create new user document
				await setDoc(userRef, {
					displayName: auth.currentUser.displayName,
					following: 0,
					followingGames: [],
					isOnboarded: false,
					photoURL: auth.currentUser.photoURL,
					uid: auth.currentUser.uid,
					description: '',
					posts: [],
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
</script>

<h1>Sign in</h1>
<button on:click={signInWithGoogle}>Sign in with Google</button>
<button on:click={signInWithFacebook}>Sign in with Facebook</button>

<h1>Sign In with email and password</h1>


<p>No account? <a href="/signup">Sign Up!</a></p>
