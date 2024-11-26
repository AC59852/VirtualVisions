<script>
    import OnboardingProfileFormComponent from '$lib/components/onboarding/OnboardingProfileFormComponent.svelte';
    import OnboardingGamesFormComponent from '$lib/components/onboarding/OnboardingGamesFormComponent.svelte';
	import { goto } from '$app/navigation';

    let onboardingForms = [
        {
            id: 1,
            componentName: "OnboardingProfileFormComponent",
            complete: false
        },
        {
            id: 2,
            componentName: "OnboardingGamesFormComponent",
            complete: false
        }
    ];

    let currentForm = onboardingForms[0];

    function nextForm(){
        let nextFormIndex = onboardingForms.findIndex(form => form.id == currentForm.id) + 1;
        currentForm = onboardingForms[nextFormIndex];

        if(currentForm === undefined){
            currentForm = {
                id: 0,
                complete: true
            }
        }
    }

    function doneOnboarding(){
        goto('/');
    }

</script>

<section class="onboarding" on:submit={nextForm}>
    {#if currentForm.complete === false}
        {#if currentForm.id === 1}
            <OnboardingProfileFormComponent/>
        {/if}
        {#if currentForm.id === 2}
            <OnboardingGamesFormComponent/>
        {/if}
    {/if}
</section>

{#if currentForm.complete === true}
    <h1>All Done</h1>
    <p>Enjoy VirtualVisions</p>
    <button on:click={doneOnboarding}>Finish</button>
{/if}

<style>
    .onboarding, button{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
    }

    h1,p{
        color: white;
    }
</style>