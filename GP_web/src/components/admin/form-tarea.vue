<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6">Añadir Tareas</div>
    </q-card-section>

    <!-- 🔹 Selección de Cliente, Proyecto, Obra, Partida y Proceso -->
    <q-card-section>
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
        @update:model-value="cargarObras"
      />
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
        @update:model-value="cargarPartidas"
      />
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
        @update:model-value="cargarProcesos"
      />
    </q-card-section>

    <!-- 📌 Tabla de Procesos y Tareas -->
    <q-card-section>
      <q-table
        :rows="procesosGuardados"
        :columns="columnasProcesos"
        row-key="idProceso"
        dense
        class="tabla-procesos"
      >
        <template v-slot:body="props">
          <q-tr :props="props" @click="seleccionarProceso(props.row)">
            <q-td key="nombreProceso">{{ props.row.nombreProceso }}</q-td>
            <q-td key="tareas">
              <div v-if="props.row.tareas.length > 0">
                <div v-for="tarea in props.row.tareas" :key="tarea.idTarea">
                  {{ tarea.nombreTarea }} - ({{ tarea.tareaTipo }})
                </div>
              </div>
              <div v-else>
                <em>Sin tareas</em>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>

    <!-- 📌 Formulario para añadir tareas -->
    <q-card-section v-if="procesoSeleccionado">
      <div class="text-subtitle1">
        Proceso Seleccionado: {{ procesoSeleccionado.nombreProceso }}
      </div>

      <!-- Se muestran todas las tareas en recuadros separados -->
      <q-card-section
        v-for="(tarea, index) in tareas"
        :key="index"
        class="q-pa-sm q-mb-sm"
        style="border: 1px solid #ccc; border-radius: 4px;"
      >
        <q-input v-model="tarea.nombreTarea" label="Nombre de la Tarea" outlined dense />
        <q-select
          v-model="tarea.tareaTipo"
          :options="['R', 'NR', 'E']"
          label="Tipo de Tarea"
          outlined
          dense
          emit-value
          map-options
        />
        <!-- Botón para eliminar la tarea del frontend -->
        <q-btn color="negative" label="Eliminar" flat @click="eliminarTarea(index)" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="secondary" label="Agregar Otra Tarea" flat @click="agregarTarea" />
        <q-btn color="primary" label="Guardar Tareas en BD" @click="guardarTodasLasTareas" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "FormTareas",
  data() {
    return {
      clienteSeleccionado: null,
      proyectoSeleccionado: null,
      obraSeleccionada: null,
      partidaSeleccionada: null,
      procesoSeleccionado: null,
      clientes: [],
      proyectos: [],
      obras: [],
      partidas: [],
      procesosGuardados: [],
      // Iniciamos con un array vacío para tareas; se agregarán nuevas tareas
      tareas: [],
      columnasProcesos: [
        { name: "nombreProceso", label: "Proceso", field: "nombreProceso", align: "left" },
        { name: "tareas", label: "Tareas - Tipo", field: "tareas", align: "left" },
      ],
    };
  },
  methods: {
    // Cargar Clientes
    async cargarClientes() {
      try {
        const response = await this.$api.get("/Clientes");
        this.clientes = response.data;
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    },
    // Cargar Proyectos de un Cliente
    async cargarProyectos() {
      if (!this.clienteSeleccionado) return;
      try {
        const response = await this.$api.get(`/Proyectos/PorCliente/${this.clienteSeleccionado}`);
        this.proyectos = response.data;
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      }
    },
    // Cargar Obras de un Proyecto
    async cargarObras() {
      if (!this.proyectoSeleccionado) return;
      try {
        const response = await this.$api.get(`/Obras/PorProyecto/${this.proyectoSeleccionado}`);
        this.obras = response.data;
      } catch (error) {
        console.error("Error cargando obras:", error);
      }
    },
    // Cargar Partidas de una Obra
    async cargarPartidas() {
      if (!this.obraSeleccionada) return;
      try {
        const response = await this.$api.get(`/Partidas/PorObra/${this.obraSeleccionada}`);
        this.partidas = response.data;
      } catch (error) {
        console.error("Error cargando partidas:", error);
      }
    },
    // Cargar Procesos y reflejarlos en la tabla con sus tareas
    async cargarProcesos() {
      if (!this.partidaSeleccionada) {
        console.warn("No hay partida seleccionada para cargar procesos.");
        return;
      }
      try {
        const response = await this.$api.get(`/Procesos/PorPartida/${this.partidaSeleccionada}`);
        this.procesosGuardados = await Promise.all(
          response.data.map(async (proceso) => {
            try {
              const tareasResponse = await this.$api.get(`/Tareas/PorProceso/${proceso.idProceso}`);
              return { ...proceso, tareas: tareasResponse.data };
            } catch (error) {
              console.error(`Error cargando tareas para proceso ${proceso.idProceso}:`, error);
              return { ...proceso, tareas: [] };
            }
          })
        );
        console.log("Procesos y tareas cargados:", this.procesosGuardados);
      } catch (error) {
        console.error("Error cargando procesos:", error);
      }
    },
    // Seleccionar un proceso y cargar sus tareas en el formulario
    seleccionarProceso(proceso) {
      if (!proceso || !proceso.idProceso) {
        console.error("Error: No se pudo seleccionar el proceso.");
        return;
      }
      this.procesoSeleccionado = { ...proceso };
      // Copiamos las tareas existentes (si las hay) o iniciamos un array vacío
      this.tareas = proceso.tareas ? JSON.parse(JSON.stringify(proceso.tareas)) : [];
      console.log("Proceso seleccionado:", this.procesoSeleccionado.nombreProceso);
    },
    // Agregar una nueva tarea (abrir un nuevo recuadro en el formulario)
    agregarTarea() {
      this.tareas.push({ nombreTarea: "", tareaTipo: "R" });
    },
    // Eliminar una tarea del frontend (del array "tareas")
    eliminarTarea(index) {
      this.tareas.splice(index, 1);
    },
    // Guardar todas las tareas en la base de datos
    async guardarTodasLasTareas() {
      if (!this.procesoSeleccionado || !this.procesoSeleccionado.idProceso) {
        this.$q.notify({ type: "negative", message: "Debe seleccionar un proceso antes de guardar tareas." });
        return;
      }
      try {
        for (const tarea of this.tareas) {
          const tareaAEnviar = {
            nombreTarea: tarea.nombreTarea,
            tareaTipo: tarea.tareaTipo,
            idProceso: this.procesoSeleccionado.idProceso,
          };
          console.log("Enviando tarea:", tareaAEnviar);
          await this.$api.post("/Tareas", tareaAEnviar);
        }
        this.$q.notify({ type: "positive", message: "Tareas guardadas con éxito!" });
        await this.cargarProcesos();
      } catch (error) {
        console.error("Error guardando tareas:", error);
        this.$q.notify({ type: "negative", message: "Error al guardar las tareas." });
      }
    },
  },
  mounted() {
    this.cargarClientes();
  },
};
</script>

<style scoped>
.form-container {
  max-width: 1200px;
  margin: 0 auto;
}
.tareas-contenedor {
  margin-top: 0.5rem;
}
</style>
