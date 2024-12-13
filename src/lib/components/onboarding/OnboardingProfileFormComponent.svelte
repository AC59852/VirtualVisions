<script>
  import { auth, firestore } from '$lib/firebase';
  import { doc, getDoc, addDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

  let displayName = "";
  let photoUpload = "";
  let userRef = null;
  let output = null;  // This will reference the <img> element
  let file;

  const storage = getStorage();

  async function submitOnboardingProfile() {
      try {
          await setDisplayName(displayName);

          if (photoUpload != "") {
              await uploadPhoto(photoUpload);
          }
      } catch (e) {
          console.error(e);
      }
  }

  async function setDisplayName(name) {
      try {
          if (name != "") {
              await updateDoc(userRef, { displayName: name });
          }
      } catch (e) {
          console.error(e);
      }
  }

  async function uploadPhoto(file) {
      const filename = `${auth.currentUser.uid}/profile-photo/${file.name}`;
      const storageRef = ref(storage, filename);

      try {
          uploadBytes(storageRef, file).then((snapshot) => {
              console.log("File uploaded!");
          });

          const uploadedPhotoURL = await getDownloadURL(storageRef);
          await updateDoc(userRef, { photoURL: uploadedPhotoURL });
      } catch (e) {
          console.error(e);
      }
  }

  function previewImage(event) {
      file = event.target.files[0];

      if (file && output) {
          output.src = URL.createObjectURL(file);  // Update the img element src
          output.onload = () => URL.revokeObjectURL(output.src);
          photoUpload = file; // Store the file for uploading later
      }
  }

  function triggerFileInput() {
    if(file == undefined) {
      return
    }

    const fileInput = document.getElementById('profilePhoto');
    fileInput.click(); // Programmatically trigger the file input's click event
  }
</script>

<form class="onboarding__form onboarding__form--profile" on:submit={submitOnboardingProfile}>
  <h1 class="onboarding__heading">Profile</h1>

  <!-- Middle row for the image and display name input -->
  <div class="onboarding__center">
    <div class="onboarding__inputWrapper onboarding__inputWrapper--photo" on:click={triggerFileInput}>
      <img bind:this={output} alt="Profile Photo" id="output" />
    
        <!-- Only show the label when there is no image selected -->
        {#if !output?.src}
            <label for="profilePhoto" class="btn">Select Photo</label>
        {/if}
    
        <input type="file" id="profilePhoto" accept="image/*" hidden on:change={previewImage} />
    </div>
    <input bind:value={displayName} placeholder="Display Name" required class="onboarding__input onboarding__input--name" />
  </div>

  <!-- Bottom row for the button -->
  <div class="onboarding__btns">
    <button class="onboarding__btn onboarding__btn--back">Back</button>
    <button class="onboarding__btn onboarding__btn--next">Next</button>
  </div>
</form>

<style>
  .onboarding__form {
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
      justify-content: center;
      background: rgba(24, 24, 24, 0.7);
      backdrop-filter: blur(4.2px);
      -webkit-backdrop-filter: blur(4.2px);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1.2rem 2rem;
      box-sizing: border-box;
      width: 620px;
      height: 690px;
  }

  .onboarding__heading {
      font-size: 4rem;
      font-family: "Outfit", sans-serif;
      font-weight: bold;
      color: white;
      margin-top: 0;
      text-align: center;
  }

  .onboarding__center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Middle row: The photo and display name input */
  .onboarding__inputWrapper--photo {
      position: relative;
      width: 200px;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: -10px auto 40px;
  }

  .onboarding__inputWrapper--photo img {
      position: absolute;
      top: 0;
      left: 0;
      background-color: #C9C9C9;
      z-index: -1;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      font-size: 0;
  }

  .btn {
      cursor: pointer;
      color: white;
      background-color: #8B8B8B;
      padding: 10px 20px;
      font-family: "Outfit", sans-serif;
      font-size: 0.8rem;
      border-radius: 5px;
      text-align: center;
      visibility: hidden;
  }

  /* Show the label when no image is set */
  .onboarding__inputWrapper--photo img:not([src]) + .btn {
      visibility: visible;
  }

  .onboarding__input {
    width: 50%;
    margin: 0 auto;
    border: none;
    border-bottom: solid 2px white;
    background: transparent;
    color: white;
    opacity: 1;
    font-family: "Outfit", sans-serif;
    font-size: 1rem;
  }

  .onboarding__input::placeholder {
    color: white;
    opacity: 1;
  }

  .onboarding__btns {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .onboarding__btn {
    font-family: "Outfit", sans-serif;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: white;
    border: none;
    color: black;
    padding: 18px 70px;
    cursor: pointer;
    border-radius: 5px;
    border: solid 2px white;
  }

  .onboarding__btn--back {
    background-color: transparent;
    color: white;
  }
</style>
