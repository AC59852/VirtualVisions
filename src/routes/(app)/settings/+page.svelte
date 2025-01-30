<script>
  import { auth, firestore } from '$lib/firebase';
  import { authStore } from '$lib/stores/user';
  import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
  import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
  import Svelecte from 'svelecte';
  import gamesList from '$lib/games/all-games.json';
	import { onMount } from 'svelte';

  let displayName = "",
      description = "",
      userRef = null,
      output = null,
      file,
      currentGames = [],
      currentGame = null,
      textarea; // Bind to textarea element

  $: if ($authStore.currentUser) {
      getUser();
      getUserGames();
  }

  $: description && adjustHeight();

  async function getUser() {
      try {
          const userDoc = await getDoc(doc(firestore, `users/${auth.currentUser.uid}`));
          const user = userDoc.data();

          if (user) {
              displayName = user.displayName || "";
              description = user.description || "";
              output.src = user.photoURL || "";

              // Adjust height after content is loaded
              setTimeout(adjustHeight, 0);
          }
      } catch (e) {
          console.error(e);
      }
  }

  const storage = getStorage();

  async function updateField(field, value) {
      try {
          userRef = doc(firestore, `users/${auth.currentUser.uid}`);
          await updateDoc(userRef, { [field]: value });
      } catch (e) {
          console.error(`Error updating ${field}:`, e);
      }
  }

  async function uploadPhoto(file) {
      const userUid = auth.currentUser.uid;
      const filename = `${userUid}/profile-photo/${file.name}`;
      const storageRef = ref(storage, filename);

      try {
          // Delete old profile photo
          const profilePhotoFolderRef = ref(storage, `${userUid}/profile-photo/`);
          const res = await listAll(profilePhotoFolderRef);
          for (const itemRef of res.items) {
              await deleteObject(itemRef);
          }

          // Upload new file
          await uploadBytes(storageRef, file);

          // Get and update Firestore with new photo URL
          const uploadedPhotoURL = await getDownloadURL(storageRef);
          await updateField("photoURL", uploadedPhotoURL);
          output.src = uploadedPhotoURL; // Update image preview
      } catch (e) {
          console.error(e);
      }
  }

  function previewImage(event) {
      file = event.target.files[0];

      if (file && output) {
          output.src = URL.createObjectURL(file);
          output.onload = () => URL.revokeObjectURL(output.src);

          // Automatically upload the image
          uploadPhoto(file);
      }
  }

  function triggerFileInput() {
      const fileInput = document.getElementById('profilePhoto');
      fileInput.click();
  }

  async function getUserGames() {
      try {
          const userDoc = await getDoc(doc(firestore, `users/${auth.currentUser.uid}`));
          const user = userDoc.data();

          if (user?.games) {
              currentGames = user.games;
          }
      } catch (e) {
          console.error(e);
      }
  }

  async function addGame(game) {

      if (currentGames.length >= 5) {
          console.warn("You can only select up to 5 games.");
          return;
      }

      try {
          const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
          await updateDoc(userRef, { games: arrayUnion(game) });

          currentGames = [...currentGames, game]; // Update locally
          currentGame = null; // Reset selection
      } catch (e) {
          console.error(e);
      }
  }

  async function removeGame(game) {
      try {
          const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
          await updateDoc(userRef, { games: arrayRemove(game) });

          currentGames = currentGames.filter(g => g !== game); // Update locally
      } catch (e) {
          console.error(e);
      }
  }

  function gameListHandler(event) {
      if (event && event.detail) {
          addGame(event.detail);
      }
  }

  function adjustHeight() {
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = textarea.scrollHeight + "px"; // Set to actual content height
    }
  }

</script>

<section class="settings">
  <h1 class="settings__heading settings__heading--large">Settings</h1>
  <section class="settings__profile">
    <h1 class="settings__heading settings__heading--small">Profile</h1>
    <div class="settings__form settings__form--profile">
        <div class="settings__inputWrapper settings__inputWrapper--photo" on:click={triggerFileInput}>
          <img bind:this={output} alt="Profile Photo" id="output" />
          <input type="file" id="profilePhoto" accept="image/*" hidden on:change={previewImage} />
        </div>
        <div class="settings__wrapper--profile">
          <input
            bind:value={displayName}
            placeholder="Display Name"
            required
            class="settings__input settings__input--name"
            on:blur={() => updateField("displayName", displayName)}
          />
          <div class="textarea-container">
            <textarea
              bind:value={description}
              placeholder="Description"
              maxlength="200"
              cols="50"
              rows="1"
              bind:this={textarea}
              on:input={adjustHeight}
              class="settings__input settings__input--description"
              id="autoExpand"
              on:blur={() => updateField("description", description)}
            />
            <div class="textarea-border"></div>
          </div>
        </div>
    </div>
  </section>
  <section class="settings__games">
    <h1 class="settings__heading settings__heading--small">Games</h1>
    <form class="settings__form settings__form--games">
        <div class="settings__wrapper--games">
          <h2 class="settings__heading settings__heading--underline">Your Games</h2>
          <ul class="settings__list">
            {#if currentGames.length === 0}
              <li class="settings__listItem settings__listItem--empty">Choose your games below</li>
            {:else}
              {#each currentGames as game}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <li class="settings__listItem">
                  <img src="/onboarding__logo.png" alt="{game.name} logo">
                  <p class="settings__text">{game.name}</p>
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <span
                    class="settings__cancel"
                    on:click={() => removeGame(game)}>
                    X
                  </span>
                </li>
              {/each}
            {/if}
          </ul>
        </div>
        <!-- Svelecte Component -->
        <Svelecte
          options={gamesList}
          on:change={gameListHandler}
          bind:selected={currentGame}
          placeholder="Choose Game (Up to 5)"
          class="svelecte-control dropdown-up"
          resetOnBlur={true}
        />
    </form>
  </section>
</section>

<style>
  .settings {
    display: flex;
		flex-direction: column;
    align-items: center;
		max-width: 850px;
		margin: 0 auto;
    padding: 60px 0;
  }

  .settings__heading {
    font-family: "Outfit", serif;
    color: white;
    font-weight: bold;
    align-self: flex-start;
    font-size: 46px;
  }

  .settings__profile, .settings__games {
    display: flex;
    flex-direction: column;
    width: 70%;
    margin-top: 60px;
    justify-content: center;
    align-items: center;
  }

  .settings__form {
    width: 80%;
    margin: 0 auto;
  }

  .settings__form--profile {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .settings__inputWrapper {
    margin: 60px 0;
    cursor: pointer;
  }

  .settings__wrapper--profile {
    display: flex;
    flex-direction: column;
    gap: 47px;
  }

  .settings__input {
    background: transparent;
    color: white;
    border: none;
    border-bottom: solid 2px white;
    font-family: "Outfit", sans-serif;
    font-size: 16px;
    font-weight: 500;
  }

  .settings__input--description {
    border: none;
  }

  .textarea-container {
    position: relative;
    width: 100%;
  }

  textarea {
    width: 100%;
    max-width: 100%;
    font-size: 16px;
    border: none;
    outline: none;
    resize: none;
    overflow: hidden;
    background: transparent;
    color: white;
  }

  .textarea-border {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: white;
    transition: top 0.2s ease-out;
  }


  .settings__heading--small {
    font-size: 36px;
  }

  .settings__heading--large {
    margin-bottom: 81px;
  }

  .settings__games {
    margin-top: 112px;
  }

  .settings__form--games {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70%;
    margin-top: 47px;
  }

  .settings__wrapper--games {
    border: solid 1px white;
    padding: 35px 40px;
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 40px;
  }

  .settings__heading--underline {
    font-size: 16px;
    border-bottom: solid 1px white;
    padding: 4px 0;
    font-weight: 500;
    margin-bottom: 25px;
  }

  .settings__list {
    display: flex;
    flex-direction: column;
    gap: 35px;
  }

  .settings__listItem {
    color: white;
    display: flex;
    align-items: center;
    font-family: "Outfit", sans-serif;
  }

  .settings__listItem img {
    height: 40px;
    width: 40px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 19px;
  }

  .settings__text {
    margin-right: auto;
  }

  .settings__cancel {
    cursor: pointer;
    color: #ED6464;
  }

  :global(.svelecte-control) {
    --sv-bg: transparent;
    --sv-border: none;
    --sv-color: white;
    --sv-item-btn-color: white;
    --sv-dropdown-bg: #181818;
    --sv-placeholder-color: white;
    --sv-dropdown-height: 200px;
    --sv-dropdown-active-bg: #353535;
    width: 100%;
    border: none;
    opacity: 1;
    border-bottom: solid 2px white;
    font-family: "Outfit", sans-serif;
    cursor: pointer;
  }

  :global(.sv-item--content) {
    overflow: visible !important;
  }

  :global(.sv-input--text) {
    color: white;
    opacity: 1;
  }
</style>
