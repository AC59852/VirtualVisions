<script>

    let followingGames = []

    //Function to return back to the display name page
    //Backpage behaviour
    async function VVBackToProfile(){
        try{
            //Sets the profile portion of the object back to false
        } catch (e){
            console.error('Error going to previous page:', e);
        }
    }


    //Function to go to finished page
    async function VVFinishedOnboarding(){
        try{
            //Sets the array of followed games 
            //Moves to next page
        } catch(e){
            console.error('Error going to finished page:', e);
        }
    }

</script>

<h1>Games</h1>

<p>Choose a game (Up to 5)</p>

<button on:click={addGameToList}>Minecraft</button>
<button on:click={addGameToList}>Silent Hill</button>
<button on:click={addGameToList}>Castleminer Z</button>
<button on:click={addGameToList}>Killing Floor 2</button>
<button on:click={addGameToList}>XCOM</button>

<p>Current Games: {followingGames}</p>

<button on:click={VVBackToProfile}>Back</button>
<button on:click={VVToFinishedPage}>Next</button>

