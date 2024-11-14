<script>

    import { auth, firestore } from '$lib/firebase';
    import { goto } from '$app/navigation';
    import { signOut, onAuthStateChanged } from 'firebase/auth';
    import { user } from '$lib/stores/user';
    import { onDestroy, onMount } from 'svelte';
    import { doc, getDoc, addDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
    import { getStorage, ref, uploadBytes,  getDownloadURL} from 'firebase/storage';

    //let loading = true; // Track if auth state is still loading
    let displayName = ""
    //let userPfp = "gs://virtual-visions.appspot.com/DefaultVV.jfif";
    let userPfp = "";

    const userRef = doc(firestore, 'users', auth.currentUser.uid);

    onMount(() => {
        if(auth.currentUser == null){
            goto('/login');
        }
        /*onAuthStateChanged(auth, (currentUser) => {
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
        });*/
    });
    
    /*
    // Store the unsubscribe function to clean up the listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        user.set(currentUser); // Update the user store
        //loading = false; // Done checking the auth state
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

    

    //Send user to the game page
    async function VVToGamesPage(){
        try{

            await setDisplayName(displayName);

            //If there is no photo
            /*if (isPhoto === false){
                //Set photo to the default
            }*/
            
            if(userPfp != ""){
                //Makes the uploaded photo the user's 
                await updateDoc(userRef, {
                    photoURL: userPfp
                })
            }
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

    // TODO Make a default pfp
    async function setPhoto(){
        const file = document.querySelector("#profilePhoto").files[0]
        const filename = 'profilePhotos/' + file.name
        const storageRef = ref(storage, filename)
        try{
            
            uploadBytes(storageRef,file).then((snapshot) => {
                console.log("File uploaded!");
            })

            //sets the img in page to the just uploaded photo
            getDownloadURL(storageRef).then((url) =>
                userPfp = url
            )
        } catch(e){
            console.error(e);
        }


        
    }
    
</script>

<h1>Profile</h1>

{#if userPfp}
    <img alt="User profile pic" src={userPfp}/>
{/if}

<input bind:value={displayName} placeholder="Display Name"/>

<input type="file" id="profilePhoto">
<button on:click={setPhoto}>Choose Profile Photo</button>

<button on:click={VVBackLogin}>Back</button>
<button on:click={VVToGamesPage}>Next</button>



