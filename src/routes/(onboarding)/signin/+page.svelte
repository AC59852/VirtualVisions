<script>
	import { auth, firestore } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore';
	import { goto } from '$app/navigation';

    async function SignInWithGoogle() {
        try{
            const provider = new GoogleAuthProvider();

            await signInWithPopup(auth,provider);

            //Create user profile with google sign in
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()){
                console.log("User data: ", docSnap.data());
                // redirect to signed in page
                goto('app/signedin');
            } else{
                await setDoc(userRef, {displayName: auth.currentUser.displayName, email:auth.currentUser.email, following: [], followingGames: [], onBoardingProcess: false, photoURL: auth.currentUser.photoURL, uid: auth.currentUser.uid})
                goto('/onboarding');
            }

        } catch (e){
            console.log(e);
        }
    }

//<a href="/signedin"><button on:click={SignInWithGoogle}>Log in with Google</button></a>
</script>

<h1>Sign in</h1>
<button on:click={SignInWithGoogle}>Sign in with Google</button>

<h1>Sign In with email and password</h1>


<p>No account? <a href="/signup">Sign Up!</a></p>
