<template>
  <main>
    <h1>Home</h1>
    <button @click.prevent="logout">Logout</button>
    <router-link :to="`/profile/${store.currentUser.id}`">{{ store.currentUser.name }}</router-link>
    <div v-for="post in posts" :key="post">
      <img :src="post.file" alt="Image">
    </div>
  </main>
</template>
<script>
import { useFirebaseAuth, useFirebaseStorage } from 'vuefire';
import { doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { useUserStore } from '@/stores/user';
import { db } from '@/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

export default {
  setup() {
    const auth = useFirebaseAuth();
    const storage = useFirebaseStorage();

    const store = useUserStore();

    return {
      auth,
      store,
      storage
    };
  },

  data() {
    return {
      posts: []
    }
  },

  async mounted() {
    await this.getDocuments();
  },

  methods: {
    logout() {
      this.store.currentUser = null;

      this.auth
        .signOut()
        .then(() => {
          this.$router.push({ name: 'login' });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getDocuments() {
      // if posts are already stored in the session storage, use them
      if (sessionStorage.getItem('posts')) {
        this.posts = JSON.parse(sessionStorage.getItem('posts'));
        console.log('posts already stored in the session storage')
        return;
      } else {

      const userRef = doc(db, 'users', this.store.currentUser.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const user = userSnap.data();
        const following = user.following;

        const batchedQuery = query(
          collection(db, 'posts'),
          where('account', 'in', following)
        );

        const querySnapshot = await getDocs(batchedQuery);

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const postFileRef = ref(this.storage, data.path);

          try {
            const url = await getDownloadURL(postFileRef);
            const post = {
              id: doc.id,
              description: data.caption,
              likes: data.likes,
              file: url
            };

            this.posts.push(post);

            // store posts in the session storage
            sessionStorage.setItem('posts', JSON.stringify(this.posts));
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        console.log('no such document');
      }
    }
    }
  }
};
</script>