<script>
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import { authStore } from '$lib/stores/user';
	import { onDestroy } from 'svelte';

	// Function to sign out the user
	async function VVSignOut() {
		try {
			await signOut(auth); // Perform the sign-out
			authStore.currentUser.set(null); // Clear the user store immediately
			console.log('User signed out');
		} catch (e) {
			console.error('Sign out error:', e);
		}
	}
</script>

{#if $authStore.currentUser}
	<div>
		<h1>Signed In</h1>
		<p>Welcome, {$authStore.displayName}</p>
		<button on:click={VVSignOut}>Sign Out</button>
		<button on:click={() => console.log($authStore)}>Show User</button>
		<a href="/">home</a>
	</div>
{:else}
	<h1>Not Signed In</h1>
	<p>Please sign in to continue.</p>
{/if}

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
	h1 {
		font-family: "Outfit", sans-serif;
		font-size: 2rem;
	}

	p {
		font-family: "Outfit", sans-serif;
		font-size: 1rem;
	}

	button {
		font-family: "Outfit", sans-serif;
		font-size: 1rem;
		color: white;
		background-color: #333;
		border: none;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	a {
		font-family: "Outfit", sans-serif;
		font-size: 1rem;
		color: #333;
		text-decoration: none;
	}
</style>