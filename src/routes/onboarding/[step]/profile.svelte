<script>
    //let displayName = $state('')
    let displayName = "Your Name"

    //Back should go back to the login page

    //Send user to the game page

    //
</script>

<h1>Profile</h1>

<input bind:value={displayName} placeholder="Display Name"/>

<button on:click={VVBackLogin}>Back</button>
<button on:click={VVToGamesPage}>Next</button>