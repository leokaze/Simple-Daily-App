<template lang='pug'>
q-card
  q-card-section
    .text-h6 {{ titulo }}
  q-separator
  q-card-section( :style="{backgroundColor: colors[nota.color]}" )
    q-input.q-mb-sm( label="Titulo", v-model="nota.title", outlined )
    q-input( label="Contenido", v-model="nota.content", outlined, autogrow )
  q-separator
  q-card-section
    q-btn.q-mr-sm(
      v-for="(color, index) in colors",
      :key="index",
      round,
      :style="{backgroundColor: color}",
      @click="changeColor(index)"
    )
  q-separator
  q-card-actions( align="right" )
    q-btn( label="Cancelar", flat, v-close-popup )
    q-btn( label="Guardar", color="primary", @click="guardarNota" )
</template>

<script setup>

// ------------------- IMPORT ---------------------- //
import Nota from 'src/functions/Nota';
import { computed, onMounted, ref } from 'vue';
import { db } from 'src/functions/db';
import { Notify } from 'quasar';
import { useStore } from 'vuex';
// ------------------- VARIABLES ---------------------- //

const store = useStore();
const emit = defineEmits(["close"]);
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  notaEdit: {
    type: Nota,
    default: () => { new Nota(); }
  }
});

const colors = computed( () => store.state.config.colors );
const titulo = ref("Agregar nueva nota");
const nota = ref(new Nota());


// ------------------- FUNCIONES ---------------------- //

const changeColor = (index) => {
  nota.value.setColor(index);
}

const guardarNota = () => {
  if (props.isEdit) {
    actualizarNota();
  } else {
    addNota()
  }
}

const actualizarNota = async () => {
  console.log(`%cActualizando nota `, 'color: yellow');
  try {
    nota.value.setDate();
    await db.notas.where("id").equals(nota.value.id)
      .modify( (value, ref) => {
        ref.value = new Nota( nota.value.getData() );
      });
    console.log(`%cNota modificada `, 'color: yellow');
    Notify.create({
      color: 'positive',
      message: 'Nota actualizada',
    })
  } catch (error) {
    console.error(error);
    Notify.create({
      color: 'negative',
      message: 'Error al actualizar'
    })
  } finally {
    emit('close');
  }
}

const addNota = async () => {
  try {
    console.log(`%cGuardando nueva nota `, 'color: yellow');
    nota.value.setDate();
    const id = await db.notas.add(nota.value.getData());
    Notify.create({
      color: 'positive',
      message: 'Nota guardada!'
    });
  } catch (error) {
    Notify.create({
      color: 'negative',
      message: error.message
    })
    console.error(error);
  } finally {
    emit("close");
  }
}

const INIT_NOTA = () => {
  if (props.isEdit) {
    titulo.value = "Editando Nota";
    nota.value = new Nota( props.notaEdit.getData() );
  } 
}

// ------------------- REACTIVIDAD ---------------------- //

onMounted( INIT_NOTA )

</script>

<style lang='sass' scoped>
</style>