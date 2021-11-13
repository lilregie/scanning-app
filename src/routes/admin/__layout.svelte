<script lang="ts">
    import { chosenProject } from "$lib/store";
    import { get } from "svelte/store";
    import { goto } from "$app/navigation";
    import { browser } from "$app/env";
    if (get(chosenProject) === "" && browser) {
        goto("/")
    }
</script>
<slot/>