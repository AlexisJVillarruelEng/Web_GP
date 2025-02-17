<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6">Añadir Detalles IPERC</div>
    </q-card-section>

    <!-- 🔹 Selección de Cliente, Proyecto, Obra, Partida -->
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

    <!-- 📌 Tabla de Procesos, Tareas y Detalles IPERC -->
    <q-card-section>
      <q-table
        :rows="procesosGuardados"
        :columns="columnasProcesos"
        row-key="idProceso"
        dense
        class="tabla-procesos"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>{{ props.row.idProceso }}</q-td>
            <q-td>{{ props.row.nombreProceso }}</q-td>
            <q-td>
              <div class="tareas-contenedor">
                <div
                  class="tarea-item"
                  v-for="tarea in props.row.tareas"
                  :key="tarea.idTarea"
                  style="margin-bottom: 1rem;"
                >
                  <!-- Botón para seleccionar la tarea y visualizar sus detalles -->
                  <q-btn flat dense color="primary" @click="seleccionarTarea(tarea)">
                    {{ tarea.nombreTarea }} - ({{ tarea.tareaTipo }})
                  </q-btn>
                  <!-- Botón para agregar un nuevo detalle a esta tarea -->
                  <q-btn flat dense color="secondary" label="Añadir Detalle" @click="agregarDetalleTarea(tarea)" />
                  <!-- Tabla interna de Detalle IPERC -->
                  <div class="detalle-iperc-container">
                    <q-table
                      v-if="tarea.detalleIPERC && tarea.detalleIPERC.length > 0"
                      :rows="tarea.detalleIPERC"
                      :columns="columnasDetalleIPERC"
                      row-key="idDetalle"
                      dense
                      flat
                      style="margin-left: 1.5rem; margin-top: 0.5rem;"
                      wrap-cells
                    />
                    <div v-else>
                      <em>Aún no tiene detalle</em>
                    </div>
                  </div>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>

    <!-- 📌 Formulario para añadir Detalles IPERC -->
    <q-card-section v-if="tareaSeleccionada">
      <div class="text-subtitle1">
        Tarea Seleccionada: {{ tareaSeleccionada.nombreTarea }}
      </div>

      <q-input v-model="detalleIPERC.descPeligros" label="Descripción de Peligros" outlined dense />
      <q-select
        v-model="detalleIPERC.tipoPeligro"
        :options="['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']"
        label="Tipo de Peligro"
        outlined
        dense
      />
      <q-input v-model="detalleIPERC.riesgos" label="Riesgos" outlined dense />
      <q-select
        v-model="detalleIPERC.tipoRiesgo"
        :options="['S', 'SO']"
        label="Tipo de Riesgo"
        outlined
        dense
      />
      <q-input v-model="detalleIPERC.medidaControlDescrip" label="Medidas de Control" type="textarea" outlined dense />
      <q-input v-model="detalleIPERC.personasExpuestas" label="Personas Expuestas" type="number" outlined dense />
      <q-input v-model="detalleIPERC.procedimientosExistentes" label="Procedimientos Existentes" type="number" outlined dense />
      <q-input v-model="detalleIPERC.capacitacion" label="Capacitación" type="number" outlined dense />
      <q-input v-model="detalleIPERC.expoRiesgo" label="Exposición al Riesgo" type="number" outlined dense />
      <q-input v-model="detalleIPERC.probabilidad" label="Probabilidad" type="number" outlined dense readonly />
      <q-input v-model="detalleIPERC.severidad" label="Severidad" type="number" outlined dense />
      <q-input v-model="detalleIPERC.nivielDeRiesgo" label="Nivel de Riesgo" type="number" outlined dense readonly />
      <q-input v-model="detalleIPERC.gradoRiesgo" label="Grado de Riesgo" outlined dense readonly />

      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar Detalle IPERC" @click="guardarDetalleIPERC" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "FormDetalleIPERC",
  data() {
    return {
      clienteSeleccionado: null,
      proyectoSeleccionado: null,
      obraSeleccionada: null,
      partidaSeleccionada: null,
      tareaSeleccionada: null, // Tarea seleccionada para el formulario
      clientes: [],
      proyectos: [],
      obras: [],
      partidas: [],
      procesosGuardados: [],
      detalleIPERC: {},
      columnasProcesos: [
        { name: "nombreProceso", label: "Proceso", field: "nombreProceso", align: "left" },
        { name: "tareas", label: "Tareas y Detalles IPERC", field: "tareas", align: "left" }
      ],
      columnasDetalleIPERC: [
        { name: "descPeligros", label: "Descripción de Peligros", field: "descPeligros", align: "left" },
        { name: "tipoPeligro", label: "Tipo de Peligro", field: "tipoPeligro", align: "center" },
        { name: "riesgos", label: "Riesgos", field: "riesgos", align: "left" },
        { name: "tipoRiesgo", label: "Tipo de Riesgo", field: "tipoRiesgo", align: "center" },
        {
          name: "medidaControlDescrip",
          label: "Medidas de Control",
          field: "medidaControlDescrip",
          align: "left",
          style: "max-width:300px; white-space: normal; word-break: break-all;",
          classes: "text-wrap"
        },
        { name: "personasExpuestas", label: "Personas Expuestas", field: "personasExpuestas", align: "center" },
        { name: "procedimietntosExistentes", label: "Procedimientos Existentes", field: "procedimietntosExistentes", align: "center" },
        { name: "capacitacion", label: "Capacitación", field: "capacitacion", align: "center" },
        { name: "expoRiesgo", label: "Exposición al Riesgo", field: "expoRiesgo", align: "center" },
        { name: "probabilidad", label: "Probabilidad", field: "probabilidad", align: "center" },
        { name: "severidad", label: "Severidad", field: "severidad", align: "center" },
        { name: "nivielDeRiesgo", label: "Nivel de Riesgo", field: "nivielDeRiesgo", align: "center" },
        { name: "gradoRiesgo", label: "Grado de Riesgo", field: "gradoRiesgo", align: "center" }
      ]
    };
  },
  methods: {
    async cargarClientes() {
      this.clientes = (await this.$api.get("/Clientes")).data;
    },
    async cargarProyectos() {
      this.proyectos = (await this.$api.get(`/Proyectos/PorCliente/${this.clienteSeleccionado}`)).data;
    },
    async cargarObras() {
      this.obras = (await this.$api.get(`/Obras/PorProyecto/${this.proyectoSeleccionado}`)).data;
    },
    async cargarPartidas() {
      this.partidas = (await this.$api.get(`/Partidas/PorObra/${this.obraSeleccionada}`)).data;
    },
    async cargarProcesos() {
      try {
        this.procesosGuardados = await Promise.all(
          (await this.$api.get(`/Procesos/PorPartida/${this.partidaSeleccionada}`)).data.map(
            async proceso => {
              const tareasResp = await this.$api.get(`/Tareas/PorProceso/${proceso.idProceso}`)
                .catch(err => (err.response && err.response.status === 404) ? { data: [] } : Promise.reject(err));
              const tareas = tareasResp.data;
              const tareasConDetalles = await Promise.all(
                tareas.map(async tarea => {
                  const respDetalle = await this.$api.get(`/DetalleIPERC/PorTarea/${tarea.idTarea}`)
                    .catch(err => (err.response && err.response.status === 404) ? { data: [] } : Promise.reject(err));
                  const detallesMapeados = (respDetalle.data && respDetalle.data.length)
                    ? respDetalle.data.map(detalle => {
                        // Si viene el campo con error tipográfico, copiamos su valor a la propiedad correcta para el POST
                        if (detalle.procedimietntosExistentes !== undefined) {
                          detalle.procedimientosExistentes = detalle.procedimietntosExistentes;
                        }
                        return detalle;
                      })
                    : [];
                  return { ...tarea, detalleIPERC: detallesMapeados };
                })
              );
              return { ...proceso, tareas: tareasConDetalles };
            }
          )
        );
      } catch (error) {
        console.error("❌ Error cargando procesos y tareas:", error);
      }
    },
    seleccionarTarea(tarea) {
      this.tareaSeleccionada = tarea;
      console.log("✅ Tarea seleccionada:", tarea);
    },
    // Nuevo método: Al hacer click en "Añadir Detalle", se selecciona la tarea y se reinicia el formulario de detalle
    agregarDetalleTarea(tarea) {
      this.tareaSeleccionada = tarea;
      this.detalleIPERC = {}; // Reinicia el formulario para un nuevo detalle
      this.$q.notify({ type: "info", message: "Listo para añadir un nuevo detalle a la tarea." });
      console.log("✅ Agregar detalle para tarea:", tarea);
    },
    async guardarDetalleIPERC() {
      try {
        await this.$api.post("/DetalleIPERC", { ...this.detalleIPERC, idTarea: this.tareaSeleccionada.idTarea });
        this.$q.notify({ type: "positive", message: "Detalle IPERC añadido correctamente" });
        await this.cargarProcesos();
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Error guardando Detalle IPERC" });
      }
    }
  },
  mounted() {
    this.cargarClientes();
  }
};
</script>

<style scoped>
.text-wrap {
  white-space: normal;
}
</style>
