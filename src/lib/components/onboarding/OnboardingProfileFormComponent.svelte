<script>
    import { auth, firestore} from '$lib/firebase';
    import { doc, getDoc, addDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
    import { getStorage, ref, uploadBytes,  getDownloadURL} from 'firebase/storage';
    import { onAuthStateChanged } from 'firebase/auth';
    import { onDestroy, onMount } from 'svelte';


    let displayName = "";
    let userPfp = "";
    let photoUpload = "";

    //const userRef = doc(firestore, 'users', auth.currentUser.uid);
    const storage = getStorage();

    onMount(() => {
        /*onAuthStateChanged(auth, (currentUser) => {
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
        });*/
        onAuthStateChanged(function(user) {
            if (user) {
                const userRef = doc(firestore, 'users', auth.currentUser.uid);
            } else {
                goto('/signin');
        }
        });
    });


    async function submitOnboardingProfile(){
        //Upload and validate the user display name and profile picture
        try{
            await setDisplayName(displayName);

            if (photoUpload != ""){
                await uploadPhoto(photoUpload);
            }
        } catch(e){
            console.error(e);
        }
    }

    //Add validation and return a bool to prevent or allow default behaviour
    async function setDisplayName(name){
        try{
            if(name !=""){
                await updateDoc(userRef, {displayName: name})
            }
        } catch(e){
            console.error(e);
        }
    }

    //Uploads photo to Firebase storage
    async function uploadPhoto(file){
        const filename = 'profilePhotos/' + file.name
        const storageRef = ref(storage, filename)

        try{
            uploadBytes(storageRef,file).then((snapshot) => {
                console.log("File uploaded!");
            })

            uploadedPhotoURL = getDownloadURL(storageRef);
            await updateDoc(userRef, { photoURL: uploadedPhotoURL });
        } catch(e){
            console.error(e);
        }
    }

    //Sets photo to display for user and saves photo for uploading to Firebase
    function setPhoto(){
        photoUpload = document.querySelector("#profilePhoto").files[0];
        userPfp = URL.createObjectURL(document.querySelector("#profilePhoto").files[0]);
    }

</script>

<form>
    <h1>Profile</h1>

    {#if userPfp}
        <img alt="User profile pic" src={userPfp}/>
    {/if}

    <h1>{displayName}</h1>

    <input bind:value={displayName} placeholder="Display Name" required/>

    <input type="file" id="profilePhoto" accept="image/*">
    <button  type="button" on:click={setPhoto}>Choose Profile Photo</button>

    <button>Next</button>
</form>

<style>
    button{
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
    }

</style>