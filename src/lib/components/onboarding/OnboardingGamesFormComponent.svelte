<script>
  import gamesList from '$lib/games/all-games.json';
  import Svelecte from 'svelecte';
  import { auth, firestore } from '$lib/firebase';
  import { doc, updateDoc } from 'firebase/firestore';
  import { createEventDispatcher } from 'svelte';

  let currentGames = []; // Reactive variable for selected games
  let currentGame = null; // Bound to Svelecte
  let userRef = null;

  const dispatch = createEventDispatcher();

  // Prevent Svelecte from routing or modifying the URL
  function gameListHandler(event) {
    event.preventDefault();  // Prevent default form submission or route change

    const game = event.detail; // The selected game from Svelecte

    if (currentGames.some((g) => g.name === game.name)) {
      // If game is already in the list, remove it
      currentGames = currentGames.filter((g) => g.name !== game.name);
    } else {
      // Add the game only if the limit has not been reached
      if (currentGames.length < 5) {
        currentGames = [...currentGames, game];
      } else {
        alert("You can only select up to 5 games.");
      }
    }

    // Clear the Svelecte input field by resetting `currentGame`
    currentGame = null; // Reset Svelecte's selected binding
  }

  // Removes a game directly from the list
  function removeGame(game) {
    currentGames = currentGames.filter((g) => g !== game);
  }


  // Submit the selected games
  function submitOnboardingGames() {
    try {
      userRef = doc(firestore, `users/${auth.currentUser.uid}`);
      updateDoc(userRef, { games: currentGames });
    } catch (e) {
      console.error(e);
    }
  }

  // Go back to the previous form
  function backstepForm() {
    dispatch('backstep');
  }

</script>

<form class="onboarding__form" on:submit={submitOnboardingGames}>
  <h1 class="onboarding__heading">Games</h1>

  <div class="onboarding__center">
    <ul class="onboarding__list">
      {#if currentGames.length === 0}
        <li class="onboarding__listItem onboarding__listItem--empty">Choose your games below</li>
      {:else}
        {#each currentGames as game}
          <li class="onboarding__listItem">
            <img src="/onboarding__logo.png" alt="{game.name} logo">
            <p class="onboarding__text">{game.name}</p>
            <span 
              class="onboarding__cancel" 
              on:click={() => removeGame(game)}>
              X
            </span>
          </li>
        {/each}
      {/if}
    </ul>

    <!-- Svelecte Component -->
    <Svelecte 
      options={gamesList} 
      on:change={gameListHandler} 
      bind:selected={currentGame} 
      placeholder="Choose Game (Up to 5)" 
      class="svelecte-control dropdown-up"
      resetOnBlur={true}
    />
  </div>
  
  <div class="onboarding__btns">
    <button type="button" class="onboarding__btn onboarding__btn--back" on:click={backstepForm}>Back</button>
    <button type="submit" class="onboarding__btn onboarding__btn--next">Next</button>
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
      color: black;
  }

  .onboarding__heading {
      font-size: 4rem;
      font-family: "Outfit", sans-serif;
      font-weight: bold;
      color: white;
      margin-top: 0;
      text-align: center;
  }

  .onboarding__list {
    height: 220px;
    overflow-y: auto;
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-top: -10px;
    margin-bottom: 40px;
    padding-right: 40px;
  }

  .onboarding__listItem {
    font-family: "Outfit", sans-serif;
    font-size: 1rem;
    color: white;
    font-weight: 500;
    display: flex;
    justify-content: space-between; /* Ensures the X icon is pushed to the far right */
    align-items: center;
    width: 100%; /* Take the full width of the container */
    gap: 20px; /* Optional spacing between the name and the icon */
}

  .onboarding__listItem img {
      flex-shrink: 0; /* Prevents the image from resizing */
  }

  .onboarding__listItem span {
      flex-shrink: 0; /* Keeps the "X" in place */
  }

  .onboarding__listItem .onboarding__text {
      flex: 1; /* Allows the text to take available space */
      white-space: nowrap; /* Prevents text wrapping */
      overflow: hidden; /* Hides overflow text */
      text-overflow: ellipsis; /* Adds ellipsis for overflowed text */
      margin-left: -10px;
  }

  .onboarding__listItem--empty {
    font-family: "Outfit", sans-serif;
    font-size: 1.15rem;
    color: white;
    width: auto;
    margin-left: 40px;
  }

  .onboarding__cancel {
    color: #ED6464;
    margin-left: 10px;
    cursor: pointer;
  }

  .onboarding__center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70%;
    margin: 0 auto;
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

  :global(.svelecte-control) {
    --sv-bg: transparent;
    --sv-border: none;
    --sv-color: white;
    --sv-item-btn-color: white;
    --sv-dropdown-bg: #181818;
    --sv-placeholder-color: white;
    --sv-dropdown-height: 180px;
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