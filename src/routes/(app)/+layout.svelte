<script>
	import { auth } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { user, loading } from '$lib/stores/user';
	import { onDestroy } from 'svelte';
	import NavMenuComponent from '$lib/components/NavMenuComponent.svelte';

	let loggedInUser = null;

	// Set up the authentication state listener globally
	const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
		user.set(currentUser); // Update the user store
		loading.set(false); // Stop loading once the state is known
		console.log('User state changed:', currentUser);

		if (currentUser) {
			loggedInUser = currentUser.uid;
		}
	});

	// Cleanup listener when layout is destroyed (optional)
	onDestroy(() => {
		unsubscribe();
		console.log('Auth listener unsubscribed');
	});
</script>

<NavMenuComponent user={loggedInUser} />
<slot />
<!-- Render child routes -->
