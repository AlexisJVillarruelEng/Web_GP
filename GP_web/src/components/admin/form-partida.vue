<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6">Añadir Partidas</div>
    </q-card-section>

    <q-card-section>
      <!-- 📌 ComboBox para elegir la obra (FILTRADO SOLO LAS OBRAS DEL PROYECTO SELECCIONADO) -->
      <q-select
        v-model="obraSeleccionada"
        :options="obrasFiltradas"
        option-value="idObra"
        option-label="nombreObra"
        label="Seleccionar Obra"
        outlined
        dense
        emit-value
        map-options
      />

      <q-card-section v-for="(partida, index) in partidas" :key="index">
        <q-input v-model="partida.nombrePartida" label="Nombre de la Partida" outlined dense />
        <q-btn color="negative" label="Eliminar Partida" flat @click="eliminarPartida(index)" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar Partidas" @click="enviarPartidas" />
        <q-btn color="secondary" label="Agregar Otra Partida" flat @click="agregarPartida" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "FormPartida",
  props: {
    proyectoId: Number, // ID del proyecto seleccionado
    obras: Array // Lista de todas las obras
  },
  data() {
    return {
      obraSeleccionada: null,
      partidas: [{ nombrePartida: "" }]
    };
  },
  computed: {
    // **📌 Filtra solo las obras pertenecientes al proyecto seleccionado**
    obrasFiltradas() {
      return this.obras.filter(obra => obra.idProyecto === this.proyectoId);
    }
  },
  mounted() {
    console.log("📌 `FormPartida` montado con ID de Proyecto:", this.proyectoId);
    console.log("📌 Obras recibidas en `FormPartida`:", this.obras);
    console.log("📌 Obras filtradas en `FormPartida`:", this.obrasFiltradas);
  },
  methods: {
    agregarPartida() {
      this.partidas.push({ nombrePartida: "" });
    },
    eliminarPartida(index) {
      this.partidas.splice(index, 1);
    },
    async enviarPartidas() {
      if (!this.obraSeleccionada) {
        this.$q.notify({ type: "negative", message: "Debe seleccionar una obra antes de agregar partidas." });
        return;
      }

      try {
        for (const partida of this.partidas) {
          const partidaAEnviar = {
            nombrePartida: partida.nombrePartida,
            idObra: this.obraSeleccionada
          };
          console.log("📤 Enviando partida:", partidaAEnviar);
          await this.$api.post("/Partidas", partidaAEnviar);
        }

        this.$q.notify({ type: "positive", message: "Partidas registradas con éxito!" });
        console.log("✅ Partidas guardadas correctamente.");
      } catch (error) {
        console.error("Error guardando partidas:", error);
        this.$q.notify({ type: "negative", message: "Error al guardar las partidas." });
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: auto;
}
</style>
