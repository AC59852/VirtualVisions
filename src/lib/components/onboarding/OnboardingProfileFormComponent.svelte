<script>


    let displayName = "";
    let userPfp = "";

    function setPhoto(){

    }

</script>

<form>
    <h1>Profile</h1>

    {#if userPfp}
        <img alt="User profile pic" src={userPfp}/>
    {/if}

    <input bind:value={displayName} placeholder="Display Name"/>

    <input type="file" id="profilePhoto">
    <button on:click={setPhoto}>Choose Profile Photo</button>

    <button>Next</button>
</form>

<style>
    button{
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
    }

</style>