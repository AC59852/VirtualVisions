<script>
    import { auth,firestore } from '$lib/firebase';
    import { signOut, onAuthStateChanged } from 'firebase/auth';
    import { user } from '$lib/stores/user';
    import { onDestroy } from 'svelte';
    import { goto } from '$app/navigation';

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

    // Function to sign out the user
    async function VVSignOut() {
        try {
            await signOut(auth); // Perform the sign-out
            user.set(null); // Clear the user store immediately
            console.log('User signed out');
        } catch (e) {
            console.error('Sign out error:', e);
        }
    }

    //Function to send the user to the signed in page if onboarding complete
    async function VVFinishedOnboarding(){
        try {
            //Update the object to say onboarding is complete
             await updateDoc(userRef, {onBoardingProcess: true})
            //Redirect to the signin page
            goto('/signedin');
        } catch (e){
            console.error('Error getting to home page:', e);
        }
    }

</script>

<h1>All Done</h1>
<p>Enjoy VirtualVisions!</p>

<button on:click={VVSignOut}>Logout</button>
<button on:click={VVFinishedOnboarding}>Enter</button>

<p>Thankyou for signing up!</p>