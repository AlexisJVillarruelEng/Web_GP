<template>
  <div class="filtro-container">
    <!-- 🔍 Campo de búsqueda -->
    <q-input
      v-model="busqueda"
      label="Buscar por nombre, representante, correo o teléfono"
      outlined
      dense
      debounce="300"
      @update:model-value="emitirFiltro"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- 📅 Selector de fecha -->
    <!-- <q-input
      v-model="fechaSeleccionada"
      label="Filtrar por fecha"
      outlined
      dense
      class="q-ml-md"
      mask="####-##-##"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer" @click="abrirCalendario = true" />
      </template>
    </q-input> -->

    <!-- <q-dialog v-model="abrirCalendario">
      <q-date v-model="fechaSeleccionada" mask="YYYY-MM-DD" @update:model-value="emitirFiltro" />
    </q-dialog> -->
  </div>
</template>

<script>
export default {
  name: "AdminFiltroCliente",
  data() {
    return {
      busqueda: "",
      fechaSeleccionada: "",
      abrirCalendario: false
    };
  },
  methods: {
    emitirFiltro() {
      this.$emit("filtrar", {
        query: this.busqueda,
        // fecha: this.fechaSeleccionada
      });
    }
  }
};
</script>

<style scoped>
.filtro-container {
  display: flexbox;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 10px;
}
</style>
