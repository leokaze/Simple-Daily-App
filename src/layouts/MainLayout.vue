<template lang='pug'>
q-layout(view="lHh Lpr lFf")
  q-header(bordered)
    q-toolbar
      q-btn(flat, dense, round, icon="menu", aria-label="Menu", @click="leftDrawerOpen = !leftDrawerOpen")
      q-toolbar-title Simple daily app
  q-drawer.q-pa-md(v-model="leftDrawerOpen", show-if-above, bordered)
    .text-caption CONFIGURACIONES
        
  q-page-container
    router-view
</template>

<script setup>

// ------------------- IMPORT ---------------------- //
import { ref } from 'vue';

// ------------------- VARIABLES ---------------------- //

const leftDrawerOpen = ref( false );

// ------------------- FUNCIONES ---------------------- //

// ------------------- REACTIVIDAD ---------------------- //

</script>

<style lang='sass' scoped>
</style>