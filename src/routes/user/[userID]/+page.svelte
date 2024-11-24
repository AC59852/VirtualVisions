<script>
	import { auth, firestore } from '$lib/firebase';
    import { user } from '$lib/stores/user';
    import { page } from '$app/stores'
	import { doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore';
	import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    //User ID for the user to be rendered on the page
    let userPageID = $page.params.userID 
    //The data of the current user to be rendered in the page
    let userPage = null;
    //Var to see if the current user is following the user on the page
    let isFollowing = null;
    //To see if the user is logged in or a guest/anon
    let guest = false;
    //user posts
    let posts = [];
    $: console.log(posts);

    //Modal toggle
    let showModal = false;

    let currentPostId = null;
    console.log(auth.currentUser)

    //If the user exists get the user data
    onMount( async () => {
        //Try and get the user to be rendered
        try{
            const userRef = doc(firestore, 'users',  $page.params.userID);
            const docSnap = await getDoc(userRef);

            if(docSnap.exists()){
                userPage = docSnap.data();
                console.log(userPage);

                if(userPage.posts && userPage.posts.length > 0){
                    const postPromises = userPage.posts.map(async (postRef) => {
                        const postSnap = await getDoc(postRef);
                        return postSnap.exists() ? { id: postSnap.id, ...postSnap.data() } : null;
                    });
                    posts = (await Promise.all(postPromises)).filter((post) => post !== null);
                }
            }


        } catch (e) {
            console.error(e)
        }

        //Check if the current user is following the user on the page
        try{
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
            const docSnap = await getDoc(userRef);

            if(docSnap.exists()){
                const curUser = docSnap.data();
                isFollowing = curUser.following.find((u) => u == $page.params.userID);
            }
        } catch (e){
            console.log(e)
        }
    })

    
    function openModal(postId){
        goto(`/user/${$page.params.userID}/posts/${postId}`, {replaceState: true});
    }

    function closeModal(){
        showModal = false;
        goto(`/user/${$page.params.userID}`, { replaceState: true });
    }


</script>
{#if userPage}
    <h1>Slug: {userPageID}</h1>
    <h1>{userPage.displayName}</h1> 
    {#if userPage.uid == auth.currentUser.uid}
        <a>Edit profile</a>
    {:else if isFollowing}
        <p>Following</p>
    {:else}
        <p>Not following</p>
    {/if}

    <p>@handle</p>
    <p>{userPage.bioDesc}</p>
    <p>{userPage.posts.length} posts</p><p>{userPage.followers.length} followers</p><p>following {userPage.following.length}</p>
    <br>
    <h2>All posts</h2>
    <p>Goes over all the posts</p>
    {#if posts}
        <p>There are posts</p>
        {#each posts as post}
            <img src={post.imageUrl} on:click={()=> openModal(post.id)} alt=""/>
        {/each}
    {:else}
        <p>No posts</p>
    {/if}
{:else}
    <h1>This user does not exists :(</h1>
{/if}

{#if showModal}
    <PostModal postId={currentPostId} on:close={closeModal}/>
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
