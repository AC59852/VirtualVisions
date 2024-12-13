<script>
  import { auth, firestore } from '$lib/firebase';
  import { authStore } from '$lib/stores/user';
  import { signOut } from 'firebase/auth';
  import { doc, getDoc, addDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
  import {goto} from '$app/navigation';
  import OnboardingProfileFormComponent from '$lib/components/onboarding/OnboardingProfileFormComponent.svelte';
  import OnboardingGamesFormComponent from '$lib/components/onboarding/OnboardingGamesFormComponent.svelte';

  let onboardingForms = [
    {
      id: 1,
      componentName: "OnboardingProfileFormComponent",
      complete: false
    },
    {
      id: 2,
      componentName: "OnboardingGamesFormComponent",
      complete: false
    }
  ];

  let currentForm = onboardingForms[0];

  function nextForm(){
    let nextFormIndex = onboardingForms.findIndex(form => form.id === currentForm.id) + 1;
    currentForm = onboardingForms[nextFormIndex];

    if (currentForm === undefined){
      currentForm = {
        id: 0,
        complete: true
      }

      let userRef = doc(firestore, `users/${auth.currentUser.uid}`);

      updateDoc(userRef, { isOnboarded: true });
    }
  }

  async function VVSignOut() {
    try {
      await signOut(auth); // Perform the sign-out
      authStore.set({ currentUser: null, isLoading: false }); // Clear the user store immediately
      console.log('User signed out');
      goto('/signin');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  }
</script>
  
  <section class="onboarding__wrapper" on:submit={nextForm}>
    {#if currentForm.complete === false}
      {#if currentForm.id === 1}
        <OnboardingProfileFormComponent {currentForm} />
      {/if}
      {#if currentForm.id === 2}
        <OnboardingGamesFormComponent {currentForm} on:backstep={() => {
          console.log("test")
          currentForm = onboardingForms[0];
        }} />
      {/if}
    {/if}
  </section>
    
    {#if currentForm.complete === true}
      <div class="onboarding__wrapper">
        <div class="onboarding__form">
          <h1 class="onboarding__heading">All Done</h1>
          <div class="onboarding__center">
            <p class="onboarding__text onboarding__text--enjoy">Enjoy VirtualVisions!</p>
            <div class="onboarding__btns">
              <button type="button" class="onboarding__btn onboarding__btn--back" on:click={VVSignOut}>Logout</button>
              <button type="button" class="onboarding__btn onboarding__btn--next" on:click={() => goto('/')}>Enter</button>
            </div>
          </div>
          <p class="onboarding__text onboarding__text--signup">Thank you for signing up!</p>
        </div>
      </div>
    {/if}

    <style>
      .onboarding__wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
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
    
     .onboarding__text {
      font-family: "Outfit", sans-serif;
      color: white;
      font-weight: 500;
      text-align: center;
     }

      .onboarding__text--enjoy {
        font-size: 2.7rem;
        margin-bottom: 25px;
        font-weight: bold;
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
    