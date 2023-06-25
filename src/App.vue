<template>
  <RouterView />
</template>
<script>
  import router from './router';
  import { getCurrentUser } from 'vuefire';

  router.beforeEach(async (to) => {
    if(to.meta.requiresAuth) {
      const currentUser = await getCurrentUser();

      if(!currentUser) {
        return {
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        }
      }
    }
  })
</script>