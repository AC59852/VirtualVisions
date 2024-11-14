<script>
    import {auth, firestore} from '$lib/firebase';
    import {GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword} from 'firebase/auth';
    import { doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore';
    import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

    let email = "";
    let password = "";

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
                await setDoc(userRef, {displayName: auth.currentUser.displayName, email:auth.currentUser.email, following: [], followingGames: [], onBoardingProcess: false
                   , photoURL: auth.currentUser.photoURL, uid: auth.currentUser.uid})
                goto('/onboarding/profile');
            }

        } catch (e){
            console.log(e);
        }
    }

    async function signInEmailPassword(){
        try{
            await signInWithEmailAndPassword(auth,email, password);
            goto('/onboarding/profile')
        } catch (e){
            console.error(e);
        }
    }

//<a href="/signedin"><button on:click={loginWithGoogle}>Log in with Google</button></a>
</script>

<h1>Log in</h1>
<button on:click={loginWithGoogle}>Log in with Google</button>

<h2>Log in with email and password</h2>
<input placeholder="email..." bind:value={email}/>
<input placeholder="password..." type="password" bind:value={password}/>
<button on:click={signInEmailPassword}>Sign in with email and password</>

<p>No account? <a href="/signup">Sign Up!</a></p>
