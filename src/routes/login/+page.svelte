<script>
    import {auth, firestore} from '$lib/firebase';
    import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
    import { doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore';
    import { redirect } from '@sveltejs/kit';
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
            } else{
                await setDoc(userRef, {displayName: auth.currentUser.displayName, email:auth.currentUser.email, following: [], photoURL: auth.currentUser.photoURL, uid: auth.currentUser.uid})
            }

            // redirect to signed in page
            goto('/signedin');
        } catch (e){
            console.log(e);
        }
    }

//<a href="/signedin"><button on:click={loginWithGoogle}>Log in with Google</button></a>
</script>


<h1>Log in</h1>
<button on:click={loginWithGoogle}>Log in with Google</button>

<p>No account? <a href="/signup">Sign Up!</a></p>