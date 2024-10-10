<script>
    import {auth} from '$lib/firebase';
    import {signOut} from 'firebase/auth'

    const user = auth.currentUser;

    async function VVSignOut(){
        try{
            await signOut(auth);
        }catch(e){

        }
    }
    //<p>Welcome {user.uid}</p>
</script>

<h1>Signed In</h1>

{#if user.uid}
    <p> Welcome </p>
{:else}
    <p> Welcome, please sign in!</p>
{/if}

<button on:click={VVSignOut}>Sign Out</button>