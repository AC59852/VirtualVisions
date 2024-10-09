<script>
    import {auth} from '$lib/firebase';
    import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
    import { redirect } from '@sveltejs/kit';

    async function loginWithGoogle() {
        try{
            const provider = new GoogleAuthProvider();

            await signInWithPopup(auth,provider);

            throw redirect(308, '/signedin');
        } catch (e){
            console.log(e);
        }
    }


</script>


<h1>Log in</h1>
<a href="/signedin"><button on:click={loginWithGoogle}>Log in with Google</button></a>

<p>No account? <a href="/signup">Sign Up!</a></p>