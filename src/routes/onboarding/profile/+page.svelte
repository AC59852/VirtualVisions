<script>


    import { auth, firestore } from '$lib/firebase';
    import { goto } from '$app/navigation';
    import { signOut, onAuthStateChanged } from 'firebase/auth';
    import { user } from '$lib/stores/user';
    import { onDestroy } from 'svelte';
    import { doc, getDoc, addDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
    import { getStorage, ref, uploadBytes} from 'firebase/storage';

    //let loading = true; // Track if auth state is still loading
    let displayName = ""
    let isPhoto = false;

    /*
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

    //Back should go back to the login page
    //Sign user out and send them to Logout
    async function VVBackLogin(){
        try {
            await signOut(auth); // Perform the sign-out
            user.set(null); // Clear the user store immediately
            console.log('User signed out');
            goto('/login')

        } catch (e) {
            console.error('Sign out error:', e);
        }
    }

    const userRef = doc(firestore, 'users', auth.currentUser.uid);

    //Send user to the game page
    async function VVToGamesPage(){
        try{

            await setDisplayName(displayName);

            //If there is no photo
            if (isPhoto === false){
                //Set photo to the default
            }

            //Sets the ProfileComponent to true
            await updateDoc(userRef, {
                onBoardingProcess: [
                    {id: 0, componentName: "ProfileComponent", complete: true},
                    {id: 1, componentName: "GamesComponent", complete: false},
                    {id: 2, componentName: "FinishedComponent", complete: false}
            ]}) 
            //Send user to Games
            goto('/onboarding/games');
        } catch(e){
            console.error(e);
        }
    }

    //TODO validation on display name
    async function setDisplayName(newName){
        try{
            if (newName != ""){
                await updateDoc(userRef, {
                    displayName: newName
                })
            }
        }catch(e){
            console.error(e);
        }
    }

    
    const storage = getStorage();

    //make reactive photo
    //Make it store in the user collection via a URL 
    async function setPhoto(){
        const file = document.querySelector("#profilePhoto").files[0]
        const filename = 'profilePhotos/' + file.name
        const storageRef = ref(storage, filename)
        try{
            uploadBytes(storageRef,file).then((snapshot) => {
                console.log("File uploaded!");
            })
            isPhoto = true;
        } catch(e){
            console.error(e);
        }
    }
    
</script>

<h1>Profile</h1>

<input bind:value={displayName} placeholder="Display Name"/>

<input type="file" id="profilePhoto">
<button on:click={setPhoto}>Choose Profile Photo</button>

<button on:click={VVBackLogin}>Back</button>
<button on:click={VVToGamesPage}>Next</button>



