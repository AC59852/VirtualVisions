<template>
  <main>
    <div class="name">
      <h1>{{ user.firstName }} {{ user.lastName }}</h1>
    </div>
    <div v-for="game in gamesList" :key="game.id">
      <h2>{{ game.name }}</h2>
      <img :src="game.image" alt="test">
    </div>
  </main>
</template>

<script>
import { getCurrentUser, useFirebaseAuth } from 'vuefire';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { games } from '@/assets/games.json'

export default {
  setup() {
    const auth = useFirebaseAuth();

    return {
      auth
    }
  },

  data() {
    return {
      user: {},
      gamesList: [],
      id: this.$route.params.id
    }
  },

  async mounted() {
    await getCurrentUser(this.auth)
    .then((user) => {
      console.log(user.uid);
      if(user.uid === this.$route.params.id) {   
        this.addEditBtn();
      }
    })

    const userRef = doc(db, 'users', this.$route.params.id);
    const userSnap = await getDoc(userRef);

    if(userSnap.exists()) {
      this.user = userSnap.data();

      // use the games array to get the games the user has
      const userGames = this.user.games;

      if(userGames) {
        this.getGamesList(userGames);
      }
    } else {
      console.log('no such document');
    }
  },

  methods: {
    getGamesList(userGames) {
      // loop through the games array and get the game data
      for(let i = 0; i < userGames.length; i++) {
        // get the game data from the json file
        const game = games.find(game => game.id === userGames[i]);
        // push the game data to the gamesList array
        this.gamesList.push(game);
      }
    },

    addEditBtn() {
      // add an edit profile button within the name div
      const editProfile = document.createElement('button');
      editProfile.innerHTML = 'Edit Profile';

      // add the edit profile button to the name div
      const name = document.querySelector('.name');
      name.appendChild(editProfile);

      // add an event listener to the edit profile button
      editProfile.addEventListener('click', () => {
        // redirect to the edit profile page
        this.$router.push({ name: 'settings' });
      });
    }
  }
}
</script>

<style>

</style>