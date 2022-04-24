<template lang='pug'>
q-page
  ListaNotas( ref="listaNotas" )

  q-page-sticky( position="bottom-right", :offset="[18, 18]" )
    q-btn( fab, icon="add", color="primary", @click="notaDialog = true" )

  q-dialog( v-model="notaDialog", full-width, persistent )
    AddEditNota( @close="closeDialogAndUpdate" )
</template>

<script setup>

// ------------------- IMPORT ---------------------- //
import { ref } from 'vue';

import ListaNotas from 'src/components/ListaNotas.vue';
import AddEditNota from 'src/components/AddEditNota.vue';
// ------------------- VARIABLES ---------------------- //

const notaDialog = ref(false);
const listaNotas = ref(null);
// ------------------- FUNCIONES ---------------------- //

const closeDialogAndUpdate = () => {
  notaDialog.value = false;
  listaNotas.value.LoadNotasFromDB();
}

// ------------------- REACTIVIDAD ---------------------- //


</script>

<style lang='sass' scoped>
.lista-item
  position: relative
</style>