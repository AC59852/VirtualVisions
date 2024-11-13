<script>
	import { auth, firestore } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore';
	import { goto } from '$app/navigation';

    async function loginWithGoogle() {
        try{
            const provider = new GoogleAuthProvider();

            await signInWithPopup(auth,provider);

            //Create user profile with google sign in
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()){
                console.log("User data: ", docSnap.data());
                // redirect to signed in page
                goto('/signedin');
            } else{
                await setDoc(userRef, {displayName: auth.currentUser.displayName, email:auth.currentUser.email, following: [], followingGames: [], onBoardingProcess: [
                    {id: 0, componentName: "ProfileComponent", complete: true},
                    {id: 1, componentName: "GamesComponent", complete: false},
                    {id: 2, componentName: "FinishedComponent", complete: false}
                ], photoURL: auth.currentUser.photoURL, uid: auth.currentUser.uid})
                goto('/onboarding/profile');
            }

        } catch (e){
            console.log(e);
        }
    }

//<a href="/signedin"><button on:click={loginWithGoogle}>Log in with Google</button></a>
</script>

<h1>Log in</h1>
<button on:click={loginWithGoogle}>Log in with Google</button>

<p>No account? <a href="/signup">Sign Up!</a></p>
