<script>
    import {auth, firestore} from '$lib/firebase';
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
    import { doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore';
    import { goto } from '$app/navigation';

    let email = "";
    let password = "";
    let errorMessage = null;

    async function signUp(){
        try{
            await createUserWithEmailAndPassword(auth, email, password);
        
            //TODO add to user to user collection

            //TODO validate email and password
            //Make sure email isn't already linked
            //Make sure email is valid
            //Send an SMS or token to email
            //Make sure password is valid (over 6 chars)


            try{
                //If validation is good, sign the user in and add a user account to the Firebase user collection
                signInWithEmailAndPassword(auth,email, password)
                const userRef = doc(firestore, 'users', auth.currentUser.uid);

                try{
                    await setDoc(userRef, {displayName: "", email:auth.currentUser.email, following: [], followingGames: [], onBoardingProcess: [
                        {id: 0, componentName: "ProfileComponent", complete: false},
                        {id: 1, componentName: "GamesComponent", complete: false},
                        {id: 2, componentName: "FinishedComponent", complete: false}
                    ], photoURL: "", uid: auth.currentUser.uid})

                    //Start onboarding process
                    goto('/onboarding');
                } catch(e){
                    console.error(e)
                    errorMessage = e.message;
                }
            }
            catch{
                console.log(e);
                errorMessage = e.message;
            }
        } catch (e){
            console.log(e);
            errorMessage = e.message;
        }
    }
</script>

<h1>Sign Up Page</h1>

<input placeholder="email..." bind:value={email} />
<input placeholder="password..." type="password" bind:value={password} />

<!-- display error -->
{#if errorMessage}
    <p>{errorMessage}</p>
{/if}

<button on:click={signUp}>Sign up with email and password</button>
