<template>
  <q-page padding class="q-col-gutter-md">
    <!-- CABECERA: Bienvenida y Botón de Salir Sesión -->
    <q-bar class="q-pa-md">
      <div class="text-h6">
        Bienvenido: {{ getClientNameFromStorage() }}
      </div>
      <q-space />
      <q-btn flat label="Salir" color="negative" @click="cerrarSesion" />
    </q-bar>

    <!-- SELECTORES: Proyecto, Obra, Partida -->
    <q-card class="q-pa-md q-mb-md" v-if="clientLoaded">
      <q-card-section>
        <div class="text-h6">Seleccionar Proyecto, Obra y Partida</div>
      </q-card-section>
      <q-card-section class="row q-col-gutter-md">
        <!-- Proyecto -->
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
          class="col-4"
          @update:model-value="cargarObras"
        />
        <!-- Obra -->
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
          class="col-4"
          @update:model-value="cargarPartidas"
        />
        <!-- Partida -->
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
          class="col-4"
          @update:model-value="cargarMatrizCompleta"
        />
      </q-card-section>
    </q-card>

    <!-- MATRIZ IPERC: Procesos, Tareas, Detalles y Firmas -->
    <q-card v-if="matrizIperc" class="q-pa-md q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">
          Matriz IPERC de la Partida {{ getPartidaName(partidaSeleccionada) }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="matrizIperc.procesos"
          :columns="columnasProcesos"
          row-key="idProceso"
          dense
          title="Procesos"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td>{{ props.row.idProceso }}</q-td>
              <q-td>{{ props.row.nombreProceso }}</q-td>
              <q-td>
                <div
                  v-for="tarea in props.row.tareas"
                  :key="tarea.idTarea"
                  style="margin-bottom: 1rem;"
                >
                  <div><strong>Tarea:</strong> {{ tarea.nombreTarea }}</div>
                  <q-table
                    wrap-cells
                    :rows="tarea.detallesIperc"
                    :columns="columnasDetalles"
                    row-key="idDetalle"
                    dense
                    flat
                    style="margin-left: 1.5rem; margin-top: 0.5rem;"
                  />
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <!-- Firmas Registradas -->
      <q-card-section v-if="matrizIperc.firmas">
        <div class="text-subtitle2 q-mb-sm">Firmas Registradas</div>
        <div v-if="firmaElaboradoImg" class="q-mt-sm">
          <div>Elaborado por: {{ getWorkerName(matrizIperc.firmas.elaboradoPor) }}</div>
          <img :src="firmaElaboradoImg" style="max-width:200px; border:1px solid #ccc;" />
        </div>
        <div v-if="firmaRevisadoImg" class="q-mt-sm">
          <div>Revisado por: {{ getWorkerName(matrizIperc.firmas.revisadoPor) }}</div>
          <img :src="firmaRevisadoImg" style="max-width:200px; border:1px solid #ccc;" />
        </div>
        <div v-if="firmaAprobadoImg" class="q-mt-sm">
          <div>Aprobado por: {{ getWorkerName(matrizIperc.firmas.aprobadoPor) }}</div>
          <img :src="firmaAprobadoImg" style="max-width:200px; border:1px solid #ccc;" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "DashboardEmpresa",
  data() {
    return {
      proyectoSeleccionado: null,
      obraSeleccionada: null,
      partidaSeleccionada: null,
      proyectos: [],
      obras: [],
      partidas: [],
      matrizIperc: null,
      clientLoaded: false,
      // Columnas para la tabla de procesos
      columnasProcesos: [
        { name: "idProceso", label: "ID Proceso", field: "idProceso" },
        { name: "nombreProceso", label: "Nombre Proceso", field: "nombreProceso" },
        { name: "tareas", label: "Tareas", field: "tareas" }
      ],
      // Columnas para la tabla de detalles IPERC con todos los campos
      columnasDetalles: [
        { name: "idDetalle", label: "ID Detalle", field: "idDetalle", align: "center" },
        { name: "descPeligros", label: "Descripción de Peligros", field: "descPeligros" },
        { name: "tipoPeligro", label: "Tipo de Peligro", field: "tipoPeligro", align: "center" },
        { name: "riesgos", label: "Riesgos", field: "riesgos" },
        { name: "tipoRiesgo", label: "Tipo de Riesgo", field: "tipoRiesgo", align: "center" },
        { name: "medidaControlDescrip", label: "Medida de Control", field: "medidaControlDescrip", style: "max-width:300px; white-space: normal; word-break: break-all;", classes: "text-wrap" },
        { name: "personasExpuestas", label: "Personas Expuestas", field: "personasExpuestas", align: "center" },
        { name: "procedimientosExistentes", label: "Procedimientos Existentes", field: "procedimientosExistentes", align: "center" },
        { name: "capacitacion", label: "Capacitación", field: "capacitacion", align: "center" },
        { name: "expoRiesgo", label: "Exposición al Riesgo", field: "expoRiesgo", align: "center" },
        { name: "probabilidad", label: "Probabilidad", field: "probabilidad", align: "center" },
        { name: "severidad", label: "Severidad", field: "severidad", align: "center" },
        // Usamos el nombre "nivielDeRiesgo" (con 'i') según tu JSON
        { name: "nivielDeRiesgo", label: "Nivel de Riesgo", field: "nivielDeRiesgo", align: "center" },
        { name: "gradoRiesgo", label: "Grado de Riesgo", field: "gradoRiesgo", align: "center" }
      ],
      // Variables para firmas
      firmaElaboradoImg: null,
      firmaRevisadoImg: null,
      firmaAprobadoImg: null,
      // Mapa de trabajadores para traducir id a nombre
      workerMap: {}
    };
  },
  methods: {
    async cargarProyectos() {
      try {
        const userStr = localStorage.getItem("userData");
        if (!userStr) {
          console.warn("No se encontró userData en localStorage.");
          return;
        }
        const user = JSON.parse(userStr);
        if (!user.id && !user.idCliente) {
          console.warn("No se encontró idCliente en userData.");
          return;
        }
        const clientId = user.id || user.idCliente;
        const resp = await this.$api.get(`/Proyectos/PorCliente/${clientId}`);
        this.proyectos = resp.data;
        this.clientLoaded = true;
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      }
    },
    async cargarObras() {
      if (!this.proyectoSeleccionado) return;
      try {
        const resp = await this.$api.get(`/Obras/PorProyecto/${this.proyectoSeleccionado}`);
        this.obras = resp.data;
      } catch (error) {
        console.error("Error cargando obras:", error);
      }
    },
    async cargarPartidas() {
      if (!this.obraSeleccionada) return;
      try {
        const resp = await this.$api.get(`/Partidas/PorObra/${this.obraSeleccionada}`);
        this.partidas = resp.data;
      } catch (error) {
        console.error("Error cargando partidas:", error);
      }
    },
    async cargarMatrizCompleta() {
      if (!this.partidaSeleccionada) {
        this.matrizIperc = null;
        return;
      }
      try {
        const idPartida = Number(this.partidaSeleccionada);
        const resp = await this.$api.get(`/MatrizIperc/${idPartida}`);
        this.matrizIperc = resp.data;
        if (this.matrizIperc.firmas) {
          if (this.matrizIperc.firmas.firmaElaboradoBase64) {
            this.firmaElaboradoImg =
              "data:image/png;base64," + this.matrizIperc.firmas.firmaElaboradoBase64;
          }
          if (this.matrizIperc.firmas.firmaRevisadoBase64) {
            this.firmaRevisadoImg =
              "data:image/png;base64," + this.matrizIperc.firmas.firmaRevisadoBase64;
          }
          if (this.matrizIperc.firmas.firmaAprobadoBase64) {
            this.firmaAprobadoImg =
              "data:image/png;base64," + this.matrizIperc.firmas.firmaAprobadoBase64;
          }
        }
      } catch (error) {
        console.error("Error al cargar la matriz IPERC:", error);
      }
    },
    getWorkerName(idTrabajador) {
      return this.workerMap[idTrabajador] || `ID: ${idTrabajador}`;
    },
    getProjectName(idProyecto) {
      const p = this.proyectos.find(x => x.idProyecto === idProyecto);
      return p ? p.nombreProyecto : "Desconocido";
    },
    getObraName(idObra) {
      const o = this.obras.find(x => x.idObra === idObra);
      return o ? o.nombreObra : "Desconocido";
    },
    getPartidaName(idPartida) {
      const pa = this.partidas.find(x => x.idPartida === idPartida);
      return pa ? pa.nombrePartida : "Desconocido";
    },
    cerrarSesion() {
      localStorage.removeItem("userData");
      this.$router.push("/");
      this.$q.notify({ type: "info", message: "Sesión cerrada" });
    },
    getClientNameFromStorage() {
      const userStr = localStorage.getItem("userData");
      if (!userStr) return "Desconocido";
      const user = JSON.parse(userStr);
      return user.nombreCliente || user.nombre || "Desconocido";
    }
  },
  async mounted() {
    if (!localStorage.getItem("userData")) {
      this.$router.push("/");
      return;
    }
    await this.cargarProyectos();
    try {
      const respTrab = await this.$api.get("/Trabajadores");
      for (const w of respTrab.data) {
        this.workerMap[w.idTrabajador] = w.nombre;
      }
    } catch (err) {
      console.error("Error al cargar trabajadores:", err);
    }
  }
};
</script>

<style scoped>
.text-wrap {
  white-space: normal;
}
</style>
