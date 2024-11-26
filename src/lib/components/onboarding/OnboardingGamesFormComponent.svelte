<script>
    import gamesList from '$lib/games/all-games.json';

    $: currentGames = [] //Probably use '$' here
    console.log(currentGames);

    //Handles adding game to list if not in list
    //Removes games from list if clicked again and game is in currentGames array
    //Highlight if game has been chosen
    function gameListHandler(game){
        console.log(game.name)
        currentGames.push(game)
        console.log(currentGames)
    }

//            <li on:click={gameListHandler}><img src={game.icon}/> {game.name}</li>
</script>

<form>
    <h1>Games Component</h1>
    <ul>
        {#each gamesList as game}
            <li on:click={() => gameListHandler(game)}>{game.name}</li>
        {/each}
    </ul>

    <h1>Current games:</h1>
    {#each currentGames as game}
        <p>{game.name}</p>
    {/each}
    
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