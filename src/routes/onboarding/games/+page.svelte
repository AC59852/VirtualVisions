<script>

    import { auth, firestore } from '$lib/firebase';
    import { goto } from '$app/navigation';
    import { signOut, onAuthStateChanged } from 'firebase/auth';
    import { user } from '$lib/stores/user';
    import { onDestroy, onMount } from 'svelte';
    import { doc, getDoc, addDoc, setDoc, updateDoc, collection } from 'firebase/firestore';

    const userRef = doc(firestore, 'users', auth.currentUser.uid);
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

    onMount(() => {
        if(auth.currentUser == null){
            goto('/login');
        }
        /*try{
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
        } catch(e){
            console.error(e);
        }*/
        /*onAuthStateChanged(auth, (currentUser) => {
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
        });*/
    });

    let followingGamesArr = []

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
    async function VVToFinishedPage(){
        try{
            //Sets the array of followed games 
             await updateDoc(userRef, {followingGames: followingGamesArr})
            //Moves to next page
            goto('/onboarding/finished');
        } catch(e){
            console.error('Error going to finished page:', e);
        }
    }


    function addGameToList(){
        followingGamesArr.push(this.value);
    }
    //export let data;
    //export const data;

    /*<h1>Current Games:</h1>
    {#if followingGamesArr}
    {#each followingGamesArr as game}
        <p>{game}</p>
    {/each}
    {/if}*/

</script>

<h1>Games</h1>

<p>Choose a game (Up to 5)</p>

<button on:click={addGameToList} value="Minecraft">Minecraft</button>
<button on:click={addGameToList} value="Silent Hill">Silent Hill</button>
<button on:click={addGameToList} value="Castleminer Z">Castleminer Z</button>
<button on:click={addGameToList} value="Killing Floor 2">Killing Floor 2</button>
<button on:click={addGameToList} value="XCOM">XCOM</button>




<button on:click={VVBackToProfile}>Back</button>
<button on:click={VVToFinishedPage}>Next</button>