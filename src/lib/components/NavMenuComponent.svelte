<script>
  import { page } from '$app/stores';
  import { onMount } from "svelte";
  import { auth } from '$lib/firebase';
  import { signOut } from 'firebase/auth';

  export let user;

  let userData;
  let scrollPosition = 0;
  let hideTopBar = false;

  onMount(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY + 10) {
        console.log("Hiding top bar");
        hideTopBar = true; // Hide the top bar when scrolling down
      } else if (currentScrollY < lastScrollY - 5) {
         console.log("Revealing top bar");
        hideTopBar = false; // Reveal the top bar when scrolling up
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  async function VVSignOut(event) {
    event.preventDefault();

    try {
      await signOut(auth); // Perform the sign-out
      authStore.set({ currentUser: null, isLoading: false }); // Clear the user store immediately
      console.log('User signed out');
      goto('/signin');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  }

  async function getUser() {
    try {
      const response = await fetch('/api/get-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user }),
      });
      let data = await response.json();

      userData = data.user;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }

  $: user && getUser();

  $: currentPath = $page.url.pathname;

  // Responsive flag
  let isMobile = false;

  // Listen for window resize to determine if it's mobile
  if (typeof window !== 'undefined') {
    const checkMobile = () => {
      isMobile = window.innerWidth <= 768;
    };
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check
  }
</script>

{#if isMobile}
<header class="mobile-menu__top {hideTopBar ? 'hidden' : ''}">
  <h1 class="mobile-menu__title">Virtual Visions</h1>
  <div class="mobile-menu__settings">
    <a href="/" on:click={VVSignOut}>Sign Out</a>
    <a href="/settings" class="mobile-menu__settings">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#838383" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu__icon menu__icon--settings">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    </a>
  </div>
</header>
<nav class="mobile-menu">
  <div class="mobile-menu__bottom">
    <a href="/" class="menu__link {currentPath === '/' ? 'active' : ''}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#838383" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu__icon menu__icon--home">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </a>
    <a href="/explore" class="menu__link {currentPath === '/explore' ? 'active' : ''}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#838383" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu__icon menu__icon--search">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </a>
    <a href="/post/new" class="menu__link menu__link--post {currentPath === '/post/new' ? 'active' : ''}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#838383" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu__icon menu__icon--post">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
    </a>
    <a href="/user/{userData?.uid}/following" class="menu__link {currentPath === '/following' ? 'active' : ''}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#838383" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu__icon menu__icon--following">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </a>
    <a href="/user/{userData?.uid}" class="menu__link {currentPath === '/profile' ? 'active' : ''}">
      <img src="{userData?.photoURL}" alt="Profile icon" class="menu__photo">
    </a>
  </div>
</nav>
{:else}
<!-- Original navigation remains here -->

<nav class="menu">
  <a href="/" class="menu__link menu__link--title">
    <h1 class="menu__title">Virtual Visions</h1>
  </a>
  <ul class="menu__list">
    <li class="menu__listItem menu__listItem--post {currentPath === '/post/new' ? 'active' : ''}">
      <a href="/post/new" class="menu__link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#838383" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu__icon menu__icon--post">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <span>Post</span>
      </a>
    </li>
    <li class="menu__listItem menu__listItem--home {currentPath === '/' ? 'active' : ''}">
      <a href="/" class="menu__link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#838383" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu__icon menu__icon--home">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Home</span>
      </a>
    </li>
    <li class="menu__listItem menu__listItem--explore {currentPath === '/explore' ? 'active' : ''}">
      <a href="/explore" class="menu__link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#838383" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu__icon menu__icon--search">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Explore</span>
      </a>
    </li>
    <li class="menu__listItem menu__listItem--following {currentPath === '/following' ? 'active' : ''}">
      <a href="/user/{userData?.uid}" class="menu__link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#838383" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu__icon menu__icon--following">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Following</span>
      </a>
    </li>
    <li class="menu__listItem menu__listItem--profile {currentPath === '/profile' ? 'active' : ''}">
      <a href="/user/{userData?.uid}" class="menu__link">
        <img src="{userData?.photoURL}" alt="Profile icon" class="menu__photo">
        <span>Profile</span>
      </a>
    </li>
    <li class="menu__listItem menu__listItem--settings {currentPath === '/settings' ? 'active' : ''}">
      <a href="/settings" class="menu__link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#838383" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu__icon menu__icon--settings">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <span>Settings</span>
      </a>
    </li>
  </ul>
</nav>
{/if}

<style>
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 265px;
    height: 100vh;
    border-right: solid 2px #D9D9D9;
    z-index: 9999;
    box-sizing: border-box;
    padding-top: 55px;
  }

  .menu__link {
    text-decoration: none;
    display: flex;
    align-items: center;
    color: white;
    gap: 12px;
    font-size: 1rem;
    font-family: 'Outfit', serif;
  }

  .menu__link--title {
    display: flex;
    justify-content: center;
    margin-bottom: 56px;
  }

  .menu__title {
    font-family: 'Outfit', serif;
    font-optical-sizing: auto;
    font-size: 1.75rem;
    font-weight: 600;
    color: white;
  }

  .menu__list {
    list-style: none;
    margin-left: 35px;
  }

  .menu__listItem {
    margin-bottom: 24px;
  }

  .menu__listItem .menu__link span {
    transition: all 0.3s ease-in-out;
    border-bottom: solid 2px transparent;
    padding: 4px 0;
  }

  .menu__listItem.active .menu__link span {
    border-bottom: solid 2px white;
  }

  .menu__icon {
    width: 24px;
    height: 24px;
    transition: all 0.1s ease-in-out;
  }

  .menu__photo {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }

  .menu__listItem--settings {
    position: absolute;
    bottom: 0;
    left: 35px;
    margin-bottom: 24px;
  }

  .menu__listItem:hover .menu__icon {
    stroke: rgb(207, 207, 207); /* Define your highlight color in CSS variables or replace this */
  }
  
  .menu__listItem.active .menu__icon {
    stroke: white; /* Define your highlight color in CSS variables or replace this */
  }

  .mobile-menu {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #0a0a0a;
  z-index: 1000;
}

.mobile-menu__top {
  position: fixed;
  top: 0;
  width: 100%;
  left: 0;
  background-color: #0a0a0a;
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  box-sizing: border-box;
  align-items: center;
  border-bottom: solid 1px rgb(226, 226, 226);
  z-index: 99999;
  transition: top 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.hidden {
  top: -100%;
}

.mobile-menu__title {
  font-size: 1.2rem;
  font-family: 'Outfit', serif;
  color: white;
}

.mobile-menu__settings {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "Outfit", sans-serif;
  font-size: 0.9rem;
}

.mobile-menu__settings a {
  color: white;
  text-decoration: none;
}

.mobile-menu__bottom {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}

.mobile-menu__bottom .menu__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  text-decoration: none;
  gap: 4px;
}

.mobile-menu__bottom .menu__link span {
  font-size: 0.8rem;
}

@media screen and (max-width: 768px) {
  .menu__icon, .menu__photo {
    width: 26px;
    height: 26px;
  }
}

</style>