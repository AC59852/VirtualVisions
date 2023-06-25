<template>
  <main>
    <h1>Home</h1>
    <button @click.prevent="logout">Logout</button>
  </main>
</template>
<script>
  import { collection } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { useFirebaseAuth } from 'vuefire'

  export default {
    setup() {
      const auth = useFirebaseAuth();

      return {
        auth
      }
    },

    data() {
      return {
        documents: []
      }
    },

    methods: {
      logout() {
        this.auth.signOut()
          .then(() => {
            this.$router.push({ name: 'login' });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    firestore: {
      documents: collection(db, 'documents')
    }
  }
</script>