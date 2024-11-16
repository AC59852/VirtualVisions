<script>
	import { auth } from '$lib/firebase';
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { user } from '$lib/stores/user';
	import { onDestroy } from 'svelte';

	let loading = true; // Track if auth state is still loading

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
	});

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
</script>

{#if loading}
	<h1>Loading...</h1>
	<p>Please wait while we verify your credentials.</p>
{:else if $user}
	<h1>Signed In</h1>
	<p>Welcome, {$user.displayName}</p>
	<button on:click={VVSignOut}>Sign Out</button>
	<button on:click={() => console.log($user)}>Show User</button>
	<a href="/">home</a>
{:else}
	<h1>Not Signed In</h1>
	<p>Please sign in to continue.</p>
{/if}
