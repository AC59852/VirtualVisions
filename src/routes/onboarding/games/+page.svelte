<script>

    import { auth } from '$lib/firebase';
    import { goto } from '$app/navigation';
    import { signOut, onAuthStateChanged } from 'firebase/auth';
    import { user } from '$lib/stores/user';
    import { onDestroy } from 'svelte';

    /*let loading = true; // Track if auth state is still loading

    // Store the unsubscribe function to clean up the listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        user.set(currentUser); // Update the user store
        loading = false; // Done checking the auth state
        console.log('User state changed:', currentUser);
    });

    // Ensure the listener is removed when the component is destroyed
    onDestroy(() => {
        console.log('Component destroyed, removing auth listener');
        unsubscribe(); // Clean up the listener
        user.set(null); // Clear the user store
    });*/

    let followingGames = []

    //Function to return back to the display name page
    //Backpage behaviour
    async function VVBackToProfile(){
        try{
            //Sets the profile portion of the object back to false
        } catch (e){
            console.error('Error going to previous page:', e);
        }
    }


    //Function to go to finished page
    function VVToFinishedPage(){
        try{
            //Sets the array of followed games 
            //Moves to next page
            goto('/onboarding/finished');
        } catch(e){
            console.error('Error going to finished page:', e);
        }
    }


async function addGameToList(){

}
    //export let data;
    //export const data;

</script>

<h1>Games</h1>

<p>Choose a game (Up to 5)</p>

<button on:click={addGameToList}>Minecraft</button>
<button on:click={addGameToList}>Silent Hill</button>
<button on:click={addGameToList}>Castleminer Z</button>
<button on:click={addGameToList}>Killing Floor 2</button>
<button on:click={addGameToList}>XCOM</button>

<p>Current Games: {followingGames}</p>

<button on:click={VVBackToProfile}>Back</button>
<button on:click={VVToFinishedPage}>Next</button>