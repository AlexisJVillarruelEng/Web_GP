<template>
  <div class="filtro-container">
    <!-- 🔍 Campo de búsqueda -->
    <q-input
      v-model="busqueda"
      label="Buscar por nombre, apellido, DNI o correo"
      outlined
      dense
      debounce="300"
      @update:model-value="emitirFiltro">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- 📅 Selector de fecha con calendario -->
    <q-input
      v-model="fechaSeleccionada"
      label="Filtrar por fecha"
      outlined
      dense
      class="q-ml-md"
      mask="####-##-##">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer" @click="abrirCalendario = true" />
      </template>
    </q-input>

    <q-dialog v-model="abrirCalendario">
      <q-date v-model="fechaSeleccionada" mask="YYYY-MM-DD" @update:model-value="emitirFiltro" />
    </q-dialog>

    <!-- 🎚️ Selector de estado (Activos/Inactivos) -->
    <q-select
      v-model="estadoSeleccionado"
      :options="opcionesEstado"
      label="Estado"
      outlined
      dense
      class="q-ml-md"
      @update:model-value="emitirFiltro"
      map-options
      emit-value
    />
  </div>
</template>

<script>
export default {
  name: "AdminFiltroFechaEstadoBusqueda",
  data() {
    return {
      busqueda: "", // Input de búsqueda
      fechaSeleccionada: "", // Fecha seleccionada en el calendario
      estadoSeleccionado: "Todos", // Estado seleccionado como string
      abrirCalendario: false, // Controla la apertura del calendario

      // Opciones del selector de estado
      opcionesEstado: [
        { label: "Todos", value: "Todos" },
        { label: "Activos", value: "Activo" },
        { label: "Inactivos", value: "Inactivo" }
      ]
    };
  },
  methods: {
    emitirFiltro() {
      console.log("📤 Emitiendo filtros:", {
        query: this.busqueda,
        fecha: this.fechaSeleccionada,
        estado: this.estadoSeleccionado
      });

      this.$emit("filtrar", {
        query: this.busqueda,
        fecha: this.fechaSeleccionada,
        estado: this.estadoSeleccionado
      });
    }
  }
};
</script>

<style scoped>
.filtro-container {
  display: flex;
  align-items: center;
  justify-content: left; /* Centra horizontalmente */
  gap: 15px;
  margin-bottom: 20px;
  padding-left: 250px; /* Mueve los filtros más a la derecha */
}
</style>
