<template>
  <RouterView />
</template>
<script setup>
  import router from './router';
  import { getCurrentUser } from 'vuefire';
  import { useUserStore } from '@/stores/user';
  import { db } from '@/firebase';
  import { doc, getDoc } from 'firebase/firestore';

  router.beforeEach(async (to) => {
    const store = useUserStore();

    if(to.meta.requiresAuth) {
      // if the user in pinia already exists, don't fetch it again
      if(store.currentUser !== null) {
        console.log("user already exists")
        return;
      } else if (sessionStorage.getItem('user')) {
        console.log("user in session storage")
        store.currentUser = JSON.parse(sessionStorage.getItem('user'));
        return;
      } else {
        console.log("building user")
        const currentUser = await getCurrentUser();

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()) {
          const user = userSnap.data();
          store.currentUser = {
            id: currentUser.uid,
            email: user.email,
            username: user.username,
            name: user.firstName + " " + user.lastName,
          };

          // set session storage
          sessionStorage.setItem('user', JSON.stringify(store.currentUser));
        } else {
          console.log('no such document');
        }

        if(!currentUser) {
        return {
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        }
        }
      }
    }
  })
</script>