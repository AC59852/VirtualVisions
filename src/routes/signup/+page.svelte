<script>
    import {auth, firestore} from '$lib/firebase';
    import { createUserWithEmailAndPassword} from "firebase/auth";

    let email = "";
    let password = "";

    let errorMessage = "";

    async function signUp(){
        try{
            await createUserWithEmailAndPassword(auth, email, password);
        
            //TODO add to user to user collection

            //TODO validate email and password
            //Make sure email isn't already linked
            //Make sure email is valid
            //Send an SMS or token to email
            //Make sure password is valid (over 6 chars)
        } catch (e){
            console.log(e);
            
            errorMessage = e.message;
        }
    }

</script>

<h1>Sign Up Page</h1>

<input placeholder="email..." bind:value={email}/>
<input placeholder="password..." type="password" bind:value={password}/>

<!-- display error -->
<p>{errorMessage}</p>

<button on:click={signUp}>Sign up with email and password</button>
