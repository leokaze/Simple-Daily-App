<template lang='pug'>
div
  .text-body1.q-pa-md( v-if="notas.length === 0" ) Todavía no hay notas que mostrar. Añade uno para empezar.
  q-list.non-selectable( separator )
    q-item.lista-item(
      v-for="(nota, index) in notas",
      :key="nota.id",
      :data-id="index",
      data-nombre="alguito",
      clickable,
      :style="{backgroundColor: colors[nota.color]}"
      v-touch-swipe.mouse.right="setChecked",
      v-touch-swipe.mouse.left="setUnChecked",
      v-touch-hold.mouse="setSelected"
    )
      q-item-section( :data-id="index", :class=" nota.checked ? 'text-grey-5 text-strike' : '' " )
        q-item-label( caption, :data-id="index" ) {{ getFormatDate(nota.dateCreated) }}
        q-item-label( caption, :data-id="index" ) {{ nota.title != null? nota.title.toUpperCase() : 'Sin título' }}
        q-item-label( :data-id="index" ) {{ nota.content }}
      q-item-section( side, v-if="selected === index", @touchstart.stop, @mousedown.stop )
        q-btn( icon="close", flat, dense, round, @click="selected = -1" )
        q-btn( icon="edit", flat, dense, round, @click="editarNota(index)" )
        q-btn( icon="delete", flat, dense, round, @click="deleteNota(index)" )

  q-dialog( v-model="notaDialog", full-width, persistent )
    AddEditNota( @close="LoadNotasFromDB", :isEdit="true", :notaEdit="notaSelected" )
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import AddEditNota from 'src/components/AddEditNota.vue';
import { date, Dialog, Notify } from 'quasar';
const { formatDate } = date;
import { db } from 'src/functions/db';
import Nota from 'src/functions/Nota';
import { useStore } from 'vuex';

export default defineComponent({
  components: {AddEditNota},
  setup(/*props, context*/) {

    // --------------- VARIABLES -------------------
    const store = useStore();

    const colors = store.state.config.colors;
    const notas = ref([]);
    const selected = ref(-1);
    const notaDialog = ref(false);
    const notaSelected = ref(new Nota());
    // ------------------- FUNCIONES --------------------

    const editarNota = (index) => {
      notaSelected.value = notas.value[index];
      notaDialog.value = true;
    }

    const getFormatDate = (d) => {
      return formatDate(d, 'dddd, DD [de] MMMM [de] YYYY [a las] HH:mm:ss')
    }

    const setChecked = ({evt}) => {
      selected.value = -1
      const index = evt.target.dataset.id;
      notas.value[index].setChecked(true);
      saveChanges( index );
    }

    const setUnChecked = ({evt}) => {
      selected.value = -1
      const index = evt.target.dataset.id;
      notas.value[index].setChecked(false);
      saveChanges( index );
    }

    const setSelected = ({evt}) => {
      const index = parseInt(evt.target.dataset.id);
      if( index === selected.value ) selected.value = -1;
      else selected.value = index;
    }

    const saveChanges = async (index) => {
      try {
        console.log(`%c Salvando cambios`, 'color: yellow');
        const nota = notas.value[index];
        nota.setDate();
        await db.notas.where("id").equals(nota.id)
          .modify( (value, ref) => {
            ref.value = new Nota( nota.getData() );
          });
      } catch (error) {
        console.error(error);
      }
    }

    const deleteNota = (index) => {
      console.log(`%cEliminando nota `, 'color: yellow');
      const {id, title} = notas.value[index];

      Dialog.create({
        title: "¿Eliminar nota?",
        message: `Desea eliminar la nota "${title? title : 'sin título'}" ?`,
        ok: { label: "Eliminar", color: "negative" },
        cancel: true,
      }).onOk(async() => {
        try {
          await db.notas.where("id").equals(id).delete();
          console.log(`%cNota eliminada correctamente `, 'color: yellow');
          Notify.create({ message: "Nota eliminada", color: "positive"});
          LoadNotasFromDB();
        } catch (error) {
          console.error(error);
          Notify.create({ message: "No se pudo eliminar", color: "negative"});
        } 
      });
    }

    const LoadNotasFromDB = async () => {
      try {
        notaDialog.value = false;
        selected.value = -1;

        const col = await db.notas.orderBy('dateCreated').reverse().toArray();
        console.log('%c⧭Collection', 'color: #00bf00', col)
        const n = [];
        col.forEach(element => {
          console.log('%c⧭', 'color: #0088cc', element)
          n.push( new Nota( element ) );
        });

        notas.value = n;
        
      } catch (error) {
        console.error(error);
      }

    }

    const INIT_NOTAS = () => {
      const n = [];
      for (let index = 0; index < 20; index++) {
        const nota = new Nota({ title: "Nota " + (index + 1), content: "Contenido Aqui podría entrar mucho contenido para una sola nota de todo lo que se hizo en un solo momento. " + (index + 1) });
        nota.setDate();
        n.push(nota);
      }

      notas.value = n;
    }

    // ------------------- REACITIVIDAD ----------------------

    onMounted(LoadNotasFromDB);


    // ------------------------------ RETURN -----------------------
    return {
      notas,
      selected,
      notaDialog,
      notaSelected,
      colors,
      getFormatDate,
      setChecked,
      setUnChecked,
      setSelected,
      LoadNotasFromDB,
      editarNota,
      deleteNota,
    }
  }
})
</script>

<style lang='sass' scoped>
</style>