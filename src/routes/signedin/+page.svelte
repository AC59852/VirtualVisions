<script>
    import {auth} from '$lib/firebase';

    const user = auth.currentUser;
</script>



<h1>Signed In</h1>

<p>Welcome {user.uid}</p>