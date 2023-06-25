<template>
  <section class="login">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </section>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
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
      email: '',
      password: ''
    }
  },

  methods: {
    login() {
      signInWithEmailAndPassword(this.auth, this.email, this.password)
        .then(() => {
          // use the redirect route
          this.$router.push(this.$route.query.redirect || '/')
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}
</script>

<style>

</style>