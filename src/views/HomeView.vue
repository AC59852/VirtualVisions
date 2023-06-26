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
  import { useFirebaseAuth, useFirebaseStorage } from 'vuefire'
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
      }
    },

    data() {
      return {
        posts: []
      }
    },

    mounted() {
      this.getDocuments();
    },

    methods: {
      logout() {
        // wipe the user
        this.store.currentUser = null;

        this.auth.signOut()
          .then(() => {
            this.$router.push({ name: 'login' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      async getDocuments() {
        // using the currentUser's id, get the users they follow
        const userRef = doc(db, 'users', this.store.currentUser.id);

        await getDoc(userRef)
          .then((doc) => {
            if(doc.exists()) {
              const user = doc.data();

              // get the users the currentUser follows
              const following = user.following;

              // loop through the users the currentUser follows
              for(let i = 0; i < following.length; i++) {
                this.getSinglePost(following[i]);
              }
            } else {
              console.log('no such document 1');
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },

      async getSinglePost(follower) {
      // Use the follower ID to query for their posts
      const postQuery = query(collection(db, 'posts'), where('account', '==', follower));

      const querySnapshot = await getDocs(postQuery);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        const data = doc.data();

        const postFileRef = ref(this.storage, data.path);

        getDownloadURL(postFileRef)
        .then((url) => {
          const post = {
          id: doc.id,
          description: data.caption,
          likes: data.likes,
          file: url
        }
        
        // push the post to the posts array
        this.posts.push(post);
        })
      });
    }
    }
  }
</script>