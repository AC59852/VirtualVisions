<script>
    export let data;

    import profile from './profile.svelte'
    import games from './games.svelte'
    import finished from './finished.svelte'

    let component = profile
    if(data.step == "profile"){component = profile}
    if(data.step == "games"){ component = games}
    if(data.step == "finished") {component = finished}


    //<svelte:component this={component}/>
</script>

<svelte:component this={component}/>

<h1>{data.step}</h1>