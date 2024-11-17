<script>
	import { auth, firestore } from '$lib/firebase';
    import { user } from '$lib/stores/user';
    import { page } from '$app/stores'
	import { doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore';
	import { onMount } from 'svelte';

    let userPageID = $page.params.userID
    let userPage = null;

    console.log(auth.currentUser)

    //If the user exists get the user data
    onMount( async () => {
        try{
            const userRef = doc(firestore, 'users',  $page.params.userID);
            const docSnap = await getDoc(userRef);

            if(docSnap.exists()){
                userPage = docSnap.data();
                console.log(userPage);
            }
        } catch (e) {
            console.error(e)
        }
    })

    //If user is following user, show so, other show 'follow'

    //Think about how to read posts


</script>
{#if userPage}
    <h1>Slug: {userPageID}</h1>
    <h1>{userPage.displayName}</h1> 
    {#if userPage.uid == auth.currentUser.uid}
        <a>Edit profile</a>
    {:else}
        <p>Following</p>
        <p>Not following</p>
    {/if}

    <p>@handle</p>
    <p>{userPage.bioDesc}</p>
    <p>{userPage.posts.length} posts</p><p>{userPage.followers.length} followers</p><p>following {userPage.following.length}</p>
    <br>
    <h2>All posts</h2>
    <p>Goes over all the posts</p>
    {#if userPage.posts}
        <p>There are posts</p>
        {#each userPage.posts as post}
            <p>{post}</p>
        {/each}
    {:else}
        <p>No posts</p>
    {/if}
{:else}
    <h1>This user does not exists :(</h1>
{/if}

<style>
    h1{
        color: white
    }
    p{
        color:white
    }
    a{
        color:white
    }

</style>
