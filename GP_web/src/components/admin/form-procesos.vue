<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6">Añadir Procesos</div>
    </q-card-section>

    <q-card-section>
      <!-- 📌 ComboBox para seleccionar Cliente -->
      <q-select
        v-model="clienteSeleccionado"
        :options="clientes"
        option-value="idCliente"
        option-label="nombreCliente"
        label="Seleccionar Cliente"
        outlined
        dense
        emit-value
        map-options
        @update:model-value="cargarProyectos"
      />

      <!-- 📌 ComboBox para seleccionar Proyecto -->
      <q-select
        v-model="proyectoSeleccionado"
        :options="proyectos"
        option-value="idProyecto"
        option-label="nombreProyecto"
        label="Seleccionar Proyecto"
        outlined
        dense
        emit-value
        map-options
        :disable="!clienteSeleccionado"
        @update:model-value="cargarObras"
      />

      <!-- 📌 ComboBox para seleccionar Obra -->
      <q-select
        v-model="obraSeleccionada"
        :options="obras"
        option-value="idObra"
        option-label="nombreObra"
        label="Seleccionar Obra"
        outlined
        dense
        emit-value
        map-options
        :disable="!proyectoSeleccionado"
        @update:model-value="cargarPartidas"
      />

      <!-- 📌 ComboBox para seleccionar Partida -->
      <q-select
        v-model="partidaSeleccionada"
        :options="partidas"
        option-value="idPartida"
        option-label="nombrePartida"
        label="Seleccionar Partida"
        outlined
        dense
        emit-value
        map-options
        :disable="!obraSeleccionada"
        @update:model-value="cargarProcesos"
      />

      <!-- 📌 Cuadro de entrada para agregar procesos -->
      <q-card-section v-for="(proceso, index) in procesos" :key="index">
        <q-input v-model="proceso.nombreProceso" label="Nombre del Proceso" outlined dense />
        <q-btn color="negative" label="Eliminar" flat @click="eliminarProceso(index)" />
      </q-card-section>

      <!-- 📌 Botones de acción -->
      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar Procesos" @click="enviarProcesos" />
        <q-btn color="secondary" label="Agregar Otro Proceso" flat @click="agregarProceso" />
      </q-card-actions>
    </q-card-section>

    <!-- 📌 Tabla de procesos guardados en la partida -->
    <q-card-section>
      <q-table
        :rows="procesosGuardados"
        :columns="columnasProcesos"
        row-key="idProceso"
        dense
        bordered
      />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "FormProcesos",
  data() {
    return {
      clientes: [], proyectos: [], obras: [], partidas: [],
      clienteSeleccionado: null,
      proyectoSeleccionado: null,
      obraSeleccionada: null,
      partidaSeleccionada: null,
      procesos: [{ nombreProceso: "" }], // Lista de procesos por agregar
      procesosGuardados: [], // Procesos ya registrados en la partida
      columnasProcesos: [
        { name: "idProceso", label: "ID", field: "idProceso", align: "left" },
        { name: "nombreProceso", label: "Nombre", field: "nombreProceso", align: "left" }
      ]
    };
  },
  methods: {
    // 🔹 Cargar clientes
    async cargarClientes() {
      try {
        const response = await this.$api.get("/Clientes");
        this.clientes = response.data;
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    },

    // 🔹 Cargar proyectos de un cliente
    async cargarProyectos() {
      if (!this.clienteSeleccionado) return;
      try {
        const response = await this.$api.get(`/Proyectos/PorCliente/${this.clienteSeleccionado}`);
        this.proyectos = response.data;
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      }
    },

    // 🔹 Cargar obras de un proyecto
    async cargarObras() {
      if (!this.proyectoSeleccionado) return;
      try {
        const response = await this.$api.get(`/Obras/PorProyecto/${this.proyectoSeleccionado}`);
        this.obras = response.data;
      } catch (error) {
        console.error("Error cargando obras:", error);
      }
    },

    // 🔹 Cargar partidas de una obra
    async cargarPartidas() {
      if (!this.obraSeleccionada) return;
      try {
        const response = await this.$api.get(`/Partidas/PorObra/${this.obraSeleccionada}`);
        this.partidas = response.data;
      } catch (error) {
        console.error("Error cargando partidas:", error);
      }
    },

    // 🔹 Cargar procesos guardados en la partida
    async cargarProcesos() {
      if (!this.partidaSeleccionada) return;
      try {
        const response = await this.$api.get(`/Procesos/PorPartida/${this.partidaSeleccionada}`);
        this.procesosGuardados = response.data;
      } catch (error) {
        console.error("Error cargando procesos:", error);
      }
    },

    // 🔹 Agregar un nuevo campo de proceso
    agregarProceso() {
      this.procesos.push({ nombreProceso: "" });
    },

    // 🔹 Eliminar un proceso del frontend
    eliminarProceso(index) {
      this.procesos.splice(index, 1);
    },

    // 🔹 Guardar procesos en la API
    async enviarProcesos() {
      if (!this.partidaSeleccionada) {
        this.$q.notify({ type: "negative", message: "Debe seleccionar una partida." });
        return;
      }

      try {
        for (const proceso of this.procesos) {
          const procesoAEnviar = {
            nombreProceso: proceso.nombreProceso,
            idPartida: this.partidaSeleccionada
          };
          await this.$api.post("/Procesos", procesoAEnviar);
        }

        this.$q.notify({ type: "positive", message: "Procesos guardados con éxito!" });
        this.cargarProcesos(); // Recargar lista de procesos en la tabla
      } catch (error) {
        console.error("Error guardando procesos:", error);
        this.$q.notify({ type: "negative", message: "Error al guardar los procesos." });
      }
    }
  },
  mounted() {
    this.cargarClientes();
  }
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: auto;
}
</style>
