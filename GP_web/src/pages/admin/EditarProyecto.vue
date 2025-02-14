<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6">Editar Matriz IPERC</div>
    </q-card-section>

    <!-- 🔹 Selección de Cliente, Proyecto, Obra, Partida -->
    <q-card-section>
      <!-- Selección de Cliente -->
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

      <!-- Selección de Proyecto -->
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
        @update:model-value="seleccionarProyecto"
      />

      <!-- Formulario Proyecto (se actualiza al seleccionar proyecto) -->
      <q-card-section>
        <q-input v-model="proyecto.nombreProyecto" label="Nombre del Proyecto" outlined dense />
        <q-input v-model="proyecto.descripcion" label="Descripción del Proyecto" outlined dense type="textarea" />
        <q-input v-model="proyecto.fechaInicio" label="Fecha de Inicio" outlined dense type="date" />
        <q-input v-model="proyecto.fechaFin" label="Fecha de Fin" outlined dense type="date" />
        <q-btn color="primary" label="Guardar Proyecto" @click="enviarProyecto" />
        <q-btn color="primary" label="Actualizar Proyecto" @click="actualizarProyecto" />
        <q-btn color="primary" label="Eliminar Proyecto" @click="eliminarProyecto" />
      </q-card-section>

      <!-- Selección de Obra -->
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

      <!-- Selección de Partida -->
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
        @update:model-value="onPartidaSelected"
      />
    </q-card-section>

    <!-- Formulario Obra -->
    <q-card-section v-for="(obra, index) in obras" :key="index">
      <q-input v-model="obra.nombreObra" label="Nombre de la Obra" outlined dense />
      <q-input v-model="obra.ubicacion" label="Ubicación" outlined dense />
      <q-input v-model="obra.fechaInicio" label="Fecha de Inicio" outlined dense type="date" />
      <q-input v-model="obra.fechaFin" label="Fecha de Fin" outlined dense type="date" />
      <q-btn color="negative" label="Eliminar frontend" flat @click="eliminarObra(index)" />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn color="primary" label="Guardar Obras API" @click="enviarObras" />
      <q-btn color="secondary" label="Agregar Otra Obra Frontend" flat @click="agregarObra" />
      <q-btn color="tertiary" label="Eliminar Obra API" flat @click="eliminarObra" />
      <q-btn color="tertiary" label="Actualizar Obra API" flat @click="actualizarObra" />
    </q-card-actions>

    <!-- Formulario Partida -->
    <q-card-section v-for="(partida, index) in partidas" :key="index">
      <q-input v-model="partida.nombrePartida" label="Nombre de la Partida" outlined dense />
      <q-btn color="negative" label="Eliminar Partida Frontend" flat @click="eliminarPartida(index)" />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn color="primary" label="Guardar Partidas API" @click="enviarPartidas" />
      <q-btn color="secondary" label="Agregar Otra Partida Frontend" flat @click="agregarPartida" />
      <q-btn color="secondary" label="Actualizar Partida" flat @click="actualizarPartida" />
      <q-btn color="negative" label="Eliminar Partida API" flat @click="eliminarPartida" />
    </q-card-actions>

    <!-- 📌 Tabla de Procesos, Tareas y Detalles IPERC -->
    <q-card-section>
      <q-table :rows="procesosGuardados" :columns="columnasProcesos" row-key="idProceso" dense class="tabla-procesos">
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- Se muestra el nombre del proceso -->
            <q-td key="nombreProceso">{{ props.row.nombreProceso }}</q-td>
            <!-- Botón para seleccionar el proceso y cargarlo en el formulario -->
            <q-td key="acciones">
              <q-btn color="info" flat dense label="Seleccionar" @click.stop="seleccionarProceso(props.row)" />
            </q-td>
            <q-td key="tareas">
              <div class="tareas-contenedor">
                <div class="tarea-item" v-for="tarea in props.row.tareas" :key="tarea.idTarea">
                  <!-- Al hacer click en la tarea se carga el detalle en el formulario -->
                  <q-btn flat dense color="primary" @click="seleccionarTarea(tarea)">
                    {{ tarea.nombreTarea }} - ({{ tarea.tareaTipo }})
                  </q-btn>
                  <!-- Tabla interna de Detalle IPERC con slot para seleccionar detalle -->
                  <div class="detalle-iperc-container">
                    <q-table
                      v-if="tarea.detalleIPERC && tarea.detalleIPERC.length > 0"
                      :rows="tarea.detalleIPERC"
                      :columns="columnasDetalleIPERC"
                      dense
                      class="tabla-detalle-iperc"
                    >
                      <template v-slot:body="detalleProps">
                        <q-tr
                          :props="detalleProps"
                          @click="seleccionarDetalleIPERC(detalleProps.row)"
                          style="cursor:pointer"
                        >
                          <q-td v-for="col in detalleProps.cols" :key="col.name" :props="detalleProps">
                            {{ detalleProps.row[col.field] }}
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                    <div v-else><em>Aún no tiene detalle</em></div>
                  </div>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <!-- Botón para crear un nuevo proceso -->
      <q-card-actions align="right">
        <q-btn color="secondary" label="Nuevo Proceso" @click="nuevoProceso" />
      </q-card-actions>
    </q-card-section>

    <!-- Formulario Proceso -->
    <q-card-section>
      <div class="text-subtitle1">
        {{ procesoForm.idProceso ? "Proceso Seleccionado" : "Nuevo Proceso" }}
      </div>
      <q-input v-model="procesoForm.nombreProceso" label="Nombre del Proceso" outlined dense />
      <div class="q-mt-sm">
        <!-- Si es un proceso existente se muestran actualizar y eliminar -->
        <q-btn
          v-if="procesoForm.idProceso"
          color="primary"
          label="Actualizar Proceso"
          @click="actualizarProcesoSeleccionado"
        />
        <q-btn
          v-if="procesoForm.idProceso"
          color="negative"
          label="Eliminar Proceso"
          @click="eliminarProcesoSeleccionado"
        />
        <!-- Si es un proceso nuevo, se muestra el botón para guardarlo en BD -->
        <q-btn
          v-else
          color="primary"
          label="Agregar Proceso a BD"
          @click="guardarProcesoNuevo"
        />
      </div>
    </q-card-section>

    <!-- Formulario Tareas (del Proceso) -->
    <q-card-section v-if="procesoForm">
      <div class="text-subtitle1">Tareas del Proceso</div>
      <q-card-section v-for="(tarea, index) in tareas" :key="index">
        <q-input v-model="tarea.nombreTarea" label="Nombre de la Tarea" outlined dense />
        <q-select
          v-model="tarea.tareaTipo"
          :options="['R', 'NR', 'E']"
          label="Tipo de Tarea"
          outlined dense emit-value map-options
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="secondary" label="Agregar Tarea Frontend" flat @click="agregarTarea" />
        <q-btn color="primary" label="Guardar/Actualizar Tareas en BD" @click="guardarTodasLasTareas" />
        <!-- Botón para eliminar tarea en BD -->
        <q-btn color="primary" label="Eliminar Tarea en BD" @click="EliminarTarea" />
      </q-card-actions>
    </q-card-section>

    <!-- Formulario para Detalle IPERC (de la Tarea) -->
    <q-card-section v-if="tareaSeleccionada">
      <div class="text-subtitle1">Detalle IPERC de la Tarea: {{ tareaSeleccionada.nombreTarea }}</div>
      <q-input v-model="detalleIPERC.descPeligros" label="Descripción de Peligros" outlined dense />
      <q-select
        v-model="detalleIPERC.tipoPeligro"
        :options="['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']"
        label="Tipo de Peligro"
        outlined dense
      />
      <q-input v-model="detalleIPERC.riesgos" label="Riesgos" outlined dense />
      <q-select v-model="detalleIPERC.tipoRiesgo" :options="['S', 'SO']" label="Tipo de Riesgo" outlined dense />
      <q-input v-model="detalleIPERC.medidaControlDescrip" label="Medidas de Control" type="textarea" outlined dense />
      <q-input v-model="detalleIPERC.personasExpuestas" label="Personas Expuestas" type="number" outlined dense />
      <q-input v-model="detalleIPERC.procedimientosExistentes" label="Procedimientos Existentes" type="number" outlined dense />
      <q-input v-model="detalleIPERC.capacitacion" label="Capacitación" type="number" outlined dense />
      <q-input v-model="detalleIPERC.expoRiesgo" label="Exposición al Riesgo" type="number" outlined dense />
      <q-input v-model="detalleIPERC.probabilidad" label="Probabilidad" type="number" outlined dense readonly />
      <q-input v-model="detalleIPERC.severidad" label="Severidad" type="number" outlined dense />
      <q-input v-model="detalleIPERC.nivelDeRiesgo" label="Nivel de Riesgo" type="number" outlined dense readonly />
      <q-input v-model="detalleIPERC.gradoDeRiesgo" label="Grado de Riesgo" outlined dense readonly />
      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar Detalle IPERC" @click="guardarDetalleIPERC" />
        <q-btn color="primary" label="Actualizar Detalle IPERC" @click="actualizarDetalleIPERC" />
        <q-btn color="primary" label="Eliminar Detalle IPERC" @click="eliminarDetalleIPERC" />
      </q-card-actions>
    </q-card-section>

    <!-- Formulario Firmas -->
    <q-card-section v-if="partidaSeleccionada">
      <div class="text-subtitle1">Firmas para la Partida Seleccionada</div>

      <q-banner v-if="firmasExistentes" class="q-mb-md text-positive">
        <q-icon name="check_circle" color="positive" />
        Esta partida ya tiene firmas registradas.
      </q-banner>

      <div class="firma-container">
        <!-- Firma Elaborado -->
        <div class="firma-box">
          <q-select
            v-model="firmas.elaboradoPor"
            :options="trabajadores"
            option-value="nombre"
            option-label="nombre"
            label="Elaborado Por"
            outlined dense emit-value map-options
          />
          <div v-if="firmaElaboradoImg">
            <img :src="firmaElaboradoImg" alt="Firma Elaborado" style="max-width:300px; max-height:150px;" />
            <q-btn color="negative" label="Borrar Imagen" @click="borrarFirma('firmaElaborado')" />
          </div>
          <div v-else>
            <vue-signature-pad ref="firmaElaborado" width="300px" height="150px" class="firma-canvas" />
            <q-btn color="negative" label="Borrar Firma" @click="borrarFirma('firmaElaborado')" />
          </div>
        </div>

        <!-- Firma Revisado -->
        <div class="firma-box">
          <q-select
            v-model="firmas.revisadoPor"
            :options="trabajadores"
            option-value="nombre"
            option-label="nombre"
            label="Revisado Por"
            outlined dense emit-value map-options
          />
          <div v-if="firmaRevisadoImg">
            <img :src="firmaRevisadoImg" alt="Firma Revisado" style="max-width:300px; max-height:150px;" />
            <q-btn color="negative" label="Borrar Imagen" @click="borrarFirma('firmaRevisado')" />
          </div>
          <div v-else>
            <vue-signature-pad ref="firmaRevisado" width="300px" height="150px" class="firma-canvas" />
            <q-btn color="negative" label="Borrar Firma" @click="borrarFirma('firmaRevisado')" />
          </div>
        </div>

        <!-- Firma Aprobado -->
        <div class="firma-box">
          <q-select
            v-model="firmas.aprobadoPor"
            :options="trabajadores"
            option-value="nombre"
            option-label="nombre"
            label="Aprobado Por"
            outlined dense emit-value map-options
          />
          <div v-if="firmaAprobadoImg">
            <img :src="firmaAprobadoImg" alt="Firma Aprobado" style="max-width:300px; max-height:150px;" />
            <q-btn color="negative" label="Borrar Imagen" @click="borrarFirma('firmaAprobado')" />
          </div>
          <div v-else>
            <vue-signature-pad ref="firmaAprobado" width="300px" height="150px" class="firma-canvas" />
            <q-btn color="negative" label="Borrar Firma" @click="borrarFirma('firmaAprobado')" />
          </div>
        </div>
      </div>

      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar Firmas" @click="guardarFirmas" />
        <q-btn color="primary" label="Actualizar Firmas" @click="actualizarFirmas" />
        <q-btn color="primary" label="Eliminar Firmas" @click="eliminarFirmas" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
import { VueSignaturePad } from "vue-signature-pad";

export default {
  name: "FormDetalleIPERC",
  components: {
    VueSignaturePad
  },
  data() {
    return {
      // Selecciones
      clienteSeleccionado: null,
      proyectoSeleccionado: null,
      obraSeleccionada: null,
      partidaSeleccionada: null,
      // Para el formulario de proceso se utiliza "procesoForm"
      procesoForm: {},
      tareaSeleccionada: null,
      // Datos cargados desde la API
      clientes: [],
      proyectos: [],
      obras: [],
      partidas: [],
      procesosGuardados: [],
      trabajadores: [],
      // Para mostrar nuevas firmas convertidas de base64
      firmaElaboradoImg: null,
      firmaRevisadoImg: null,
      firmaAprobadoImg: null,
      // Arreglos para elementos nuevos (frontend)
      procesos: [],
      tareas: [],
      // Objetos para formularios
      proyecto: {
        nombreProyecto: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        idCliente: null
      },
      detalleIPERC: {},
      firmas: {
        elaboradoPor: null,
        revisadoPor: null,
        aprobadoPor: null
        // Si la API retorna un id para las firmas, se asigna a firmas.idFirma
      },
      // Para saber si existen firmas cargadas
      firmasExistentes: false,
      // Columnas para tablas
      columnasProcesos: [
        { name: "nombreProceso", label: "Proceso", field: "nombreProceso", align: "left" },
        { name: "acciones", label: "Acciones", field: "acciones", align: "center" },
        { name: "tareas", label: "Tareas y Detalles IPERC", field: "tareas", align: "left" }
      ],
      columnasDetalleIPERC: [
        { name: "descPeligros", label: "Descripción Peligros", field: "descPeligros", align: "left" },
        { name: "tipoPeligro", label: "Tipo de Peligro", field: "tipoPeligro", align: "center" },
        { name: "riesgos", label: "Riesgos", field: "riesgos", align: "left" },
        { name: "tipoRiesgo", label: "Tipo de Riesgo", field: "tipoRiesgo", align: "center" },
        { name: "medidaControlDescrip", label: "Medidas de Control", field: "medidaControlDescrip", align: "left" },
        { name: "personasExpuestas", label: "Personas Expuestas", field: "personasExpuestas", align: "center" },
        { name: "procedimientosExistentes", label: "Procedimientos Existentes", field: "procedimientosExistentes", align: "center" },
        { name: "capacitacion", label: "Capacitación", field: "capacitacion", align: "center" },
        { name: "expoRiesgo", label: "Exposición al Riesgo", field: "expoRiesgo", align: "center" },
        { name: "probabilidad", label: "Probabilidad", field: "probabilidad", align: "center" },
        { name: "severidad", label: "Severidad", field: "severidad", align: "center" },
        { name: "nivelDeRiesgo", label: "Nivel de Riesgo", field: "nivelDeRiesgo", align: "center" },
        { name: "gradoDeRiesgo", label: "Grado de Riesgo", field: "gradoDeRiesgo", align: "center" }
      ]
    };
  },
  methods: {
    /* ======================
       Métodos de Carga General
    ========================= */
    async cargarClientes() {
      try {
        const response = await this.$api.get("/Clientes");
        this.clientes = response.data;
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    },
    async cargarTrabajadores() {
      try {
        const response = await this.$api.get("/Trabajadores");
        this.trabajadores = response.data;
      } catch (error) {
        console.error("Error cargando trabajadores:", error);
      }
    },
    /* ======================
       Métodos de Proyectos
    ========================= */
    async cargarProyectos() {
      if (!this.clienteSeleccionado) return;
      try {
        const response = await this.$api.get(`/Proyectos/PorCliente/${this.clienteSeleccionado}`);
        this.proyectos = response.data;
        this.proyectoSeleccionado = null;
        this.proyecto = { nombreProyecto: "", descripcion: "", fechaInicio: "", fechaFin: "", idCliente: this.clienteSeleccionado };
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      }
    },
    async seleccionarProyecto(idProyecto) {
      this.proyectoSeleccionado = idProyecto;
      try {
        const response = await this.$api.get(`/Proyectos/${idProyecto}`);
        this.proyecto = response.data;
      } catch (error) {
        console.error("Error cargando el proyecto:", error);
      }
      this.cargarObras();
    },
    async enviarProyecto() {
      try {
        const proyectoData = { ...this.proyecto, idCliente: this.clienteSeleccionado };
        const response = await this.$api.post("/Proyectos", proyectoData);
        if (response.data && response.data.id) {
          this.$q.notify({ type: "positive", message: "Proyecto creado con éxito!" });
          this.cargarProyectos();
        } else {
          throw new Error("La API no devolvió un ID válido");
        }
      } catch (error) {
        console.error("Error al enviar el proyecto:", error);
        this.$q.notify({ type: "negative", message: "Error al crear el proyecto." });
      }
    },
    async actualizarProyecto() {
      if (!this.proyectoSeleccionado) {
        this.$q.notify({ type: "negative", message: "Seleccione un proyecto para actualizar." });
        return;
      }
      try {
        await this.$api.put(`/Proyectos/${this.proyectoSeleccionado}`, this.proyecto);
        this.$q.notify({ type: "positive", message: "Proyecto actualizado con éxito!" });
        this.cargarProyectos();
      } catch (error) {
        console.error("Error al actualizar proyecto:", error);
        this.$q.notify({ type: "negative", message: "Error al actualizar el proyecto." });
      }
    },
    async eliminarProyecto() {
      if (!this.proyectoSeleccionado) {
        this.$q.notify({ type: "negative", message: "Seleccione un proyecto para eliminar." });
        return;
      }
      try {
        await this.$api.delete(`/Proyectos/${this.proyectoSeleccionado}`);
        this.$q.notify({ type: "positive", message: "Proyecto eliminado con éxito!" });
        this.proyectoSeleccionado = null;
        this.cargarProyectos();
      } catch (error) {
        console.error("Error al eliminar proyecto:", error);
        this.$q.notify({ type: "negative", message: "Error al eliminar el proyecto." });
      }
    },
    /* ======================
       Métodos de Obras y Partidas
    ========================= */
    async cargarObras() {
      if (!this.proyectoSeleccionado) return;
      try {
        const response = await this.$api.get(`/Obras/PorProyecto/${this.proyectoSeleccionado}`);
        this.obras = response.data;
        this.obraSeleccionada = null;
      } catch (error) {
        console.error("Error cargando obras:", error);
      }
    },
    async cargarPartidas() {
      if (!this.obraSeleccionada) return;
      try {
        const response = await this.$api.get(`/Partidas/PorObra/${this.obraSeleccionada}`);
        this.partidas = response.data;
        this.partidaSeleccionada = null;
      } catch (error) {
        console.error("Error cargando partidas:", error);
      }
    },
    /* ======================
       Métodos para Partida: Procesos y Firmas
    ========================= */
    async onPartidaSelected(idPartida) {
      this.partidaSeleccionada = idPartida;
      await this.cargarProcesos();
      await this.cargarFirmas();
    },
    async cargarProcesos() {
      if (!this.partidaSeleccionada) return;
      try {
        this.procesosGuardados = await Promise.all(
          (await this.$api.get(`/Procesos/PorPartida/${this.partidaSeleccionada}`)).data.map(
            async proceso => ({
              ...proceso,
              tareas: await Promise.all(
                (await this.$api.get(`/Tareas/PorProceso/${proceso.idProceso}`)).data.map(
                  async tarea => {
                    const detalleResponse = await this.$api
                      .get(`/DetalleIPERC/PorTarea/${tarea.idTarea}`)
                      .catch(() => ({ data: [] }));
                    return { ...tarea, detalleIPERC: detalleResponse.data };
                  }
                )
              )
            })
          )
        );
      } catch (error) {
        console.error("Error cargando procesos y tareas:", error);
      }
    },
    async cargarFirmas() {
      if (!this.partidaSeleccionada) return;
      try {
        const response = await this.$api.get(`/Firmas/Matriz/${this.partidaSeleccionada}`);
        const firmaData = response.data[0]; // Extraer el primer objeto del array
        this.firmasExistentes = !!firmaData;
        console.log("✅ Firmas recuperadas:", firmaData);
        if (firmaData) {
          this.firmas.elaboradoPor = firmaData.nombreElaboradoPor;
          this.firmas.revisadoPor = firmaData.nombreRevisadoPor;
          this.firmas.aprobadoPor = firmaData.nombreAprobadoPor;
          this.cargarFirmaBase64("firmaElaborado", firmaData.firmaElaboradoUrl);
          this.cargarFirmaBase64("firmaRevisado", firmaData.firmaRevisadoUrl);
          this.cargarFirmaBase64("firmaAprobado", firmaData.firmaAprobadoUrl);
        }
      } catch (error) {
        console.warn("⚠️ No hay firmas registradas para esta partida.");
        this.firmasExistentes = false;
      }
    },
    /* ======================
       Métodos para Detalle IPERC
    ========================= */
    async guardarDetalleIPERC() {
      if (!this.tareaSeleccionada) return;
      try {
        await this.$api.post("/DetalleIPERC", { ...this.detalleIPERC, idTarea: this.tareaSeleccionada.idTarea });
        this.$q.notify({ type: "positive", message: "Detalle IPERC guardado con éxito" });
        await this.cargarProcesos();
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Error guardando Detalle IPERC" });
      }
    },
    async actualizarDetalleIPERC() {
      if (!this.detalleIPERC.id) {
        this.$q.notify({ type: "negative", message: "Seleccione un Detalle IPERC para actualizar." });
        return;
      }
      try {
        await this.$api.put(`/DetalleIPERC/${this.detalleIPERC.id}`, this.detalleIPERC);
        this.$q.notify({ type: "positive", message: "Detalle IPERC actualizado." });
        await this.cargarProcesos();
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Error actualizando Detalle IPERC." });
      }
    },
    async eliminarDetalleIPERC() {
      if (!this.detalleIPERC.id) {
        this.$q.notify({ type: "negative", message: "Seleccione un Detalle IPERC para eliminar." });
        return;
      }
      try {
        await this.$api.delete(`/DetalleIPERC/${this.detalleIPERC.id}`);
        this.$q.notify({ type: "positive", message: "Detalle IPERC eliminado." });
        await this.cargarProcesos();
        this.detalleIPERC = {};
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Error eliminando Detalle IPERC." });
      }
    },
    /* ======================
       Métodos para Procesos
    ========================= */
    nuevoProceso() {
      this.procesoForm = { nombreProceso: "" };
      this.tareas = [];
    },
    seleccionarProceso(proceso) {
      this.procesoForm = JSON.parse(JSON.stringify(proceso));
      this.tareas = proceso.tareas ? JSON.parse(JSON.stringify(proceso.tareas)) : [];
    },
    async guardarProcesoNuevo() {
      if (!this.partidaSeleccionada) {
        this.$q.notify({ type: "negative", message: "Seleccione una partida para asignar el proceso." });
        return;
      }
      try {
        const data = { ...this.procesoForm, idPartida: this.partidaSeleccionada };
        const response = await this.$api.post("/Procesos", data);
        if (response.data && response.data.id) {
          this.$q.notify({ type: "positive", message: "Proceso creado con éxito!" });
          await this.cargarProcesos();
          this.procesoForm = response.data;
        }
      } catch (error) {
        console.error("Error guardando proceso:", error);
        this.$q.notify({ type: "negative", message: "Error al guardar el proceso." });
      }
    },
    async actualizarProcesoSeleccionado() {
      if (!this.procesoForm || !this.procesoForm.idProceso) {
        this.$q.notify({ type: "negative", message: "Seleccione un proceso para actualizar." });
        return;
      }
      try {
        await this.$api.put(`/Procesos/${this.procesoForm.idProceso}`, this.procesoForm);
        this.$q.notify({ type: "positive", message: "Proceso actualizado con éxito!" });
        await this.cargarProcesos();
      } catch (error) {
        console.error("Error actualizando proceso:", error);
        this.$q.notify({ type: "negative", message: "Error al actualizar el proceso." });
      }
    },
    async eliminarProcesoSeleccionado() {
      if (!this.procesoForm || !this.procesoForm.idProceso) {
        this.$q.notify({ type: "negative", message: "Seleccione un proceso para eliminar." });
        return;
      }
      try {
        await this.$api.delete(`/Procesos/${this.procesoForm.idProceso}`);
        this.$q.notify({ type: "positive", message: "Proceso eliminado con éxito!" });
        this.procesoForm = {};
        await this.cargarProcesos();
      } catch (error) {
        console.error("Error eliminando proceso:", error);
        this.$q.notify({ type: "negative", message: "Error al eliminar el proceso." });
      }
    },
    /* ======================
       Métodos para Tareas
    ========================= */
    seleccionarTarea(tarea) {
      this.tareaSeleccionada = tarea;
      if (tarea.detalleIPERC && tarea.detalleIPERC.length > 0) {
        this.detalleIPERC = JSON.parse(JSON.stringify(tarea.detalleIPERC[0]));
      } else {
        this.detalleIPERC = {};
      }
    },
    agregarTarea() {
      this.tareas.push({ nombreTarea: "", tareaTipo: "R" });
    },
    // Se elimina el método duplicado "eliminarTarea(index)" ya que se usará "EliminarTarea" para borrar desde BD.
    async EliminarTarea() {
      if (!this.tareaSeleccionada || !this.tareaSeleccionada.idTarea) {
        this.$q.notify({ type: "negative", message: "Seleccione una tarea para eliminar." });
        return;
      }
      try {
        await this.$api.delete(`/Tareas/${this.tareaSeleccionada.idTarea}`);
        this.$q.notify({ type: "positive", message: "Tarea eliminada de la API con éxito!" });
        this.tareas = this.tareas.filter(t => t.idTarea !== this.tareaSeleccionada.idTarea);
        this.tareaSeleccionada = null;
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Error eliminando la tarea de la API." });
      }
    },
    async actualizarTarea() {
      if (!this.tareaSeleccionada || !this.tareaSeleccionada.idTarea) {
        this.$q.notify({ type: "negative", message: "Seleccione una tarea para actualizar." });
        return;
      }
      try {
        await this.$api.put(`/Tareas/${this.tareaSeleccionada.idTarea}`, this.tareaSeleccionada);
        this.$q.notify({ type: "positive", message: "Tarea actualizada con éxito!" });
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Error actualizando la tarea." });
      }
    },
    async guardarTodasLasTareas() {
      try {
        for (let tarea of this.tareas) {
          if (!tarea.idTarea) {
            tarea.idProceso = this.procesoForm.idProceso;
            const response = await this.$api.post("/Tareas", tarea);
            if (response.data && response.data.id) {
              tarea.idTarea = response.data.id;
            }
          } else {
            await this.$api.put(`/Tareas/${tarea.idTarea}`, tarea);
          }
        }
        this.$q.notify({ type: "positive", message: "Tareas guardadas/actualizadas con éxito!" });
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Error guardando/actualizando tareas." });
      }
    },
    /* ======================
       Método para seleccionar un Detalle IPERC desde la tabla interna
    ========================= */
    seleccionarDetalleIPERC(detalle) {
      this.detalleIPERC = JSON.parse(JSON.stringify(detalle));
    },
    /* ======================
       Métodos para Firmas (usando el código proporcionado)
    ========================= */
    borrarFirma(ref) {
      if (this.$refs[ref]) this.$refs[ref].clearSignature();
    },
    async guardarFirmas() {
      if (!this.partidaSeleccionada) {
        this.$q.notify({ type: "negative", message: "Debe seleccionar una partida antes de guardar firmas." });
        return;
      }
      this.firmas.firmaElaboradoBase64 = this.obtenerBase64Firma("firmaElaborado");
      this.firmas.firmaRevisadoBase64 = this.obtenerBase64Firma("firmaRevisado");
      this.firmas.firmaAprobadoBase64 = this.obtenerBase64Firma("firmaAprobado");
      try {
        console.log("📤 Enviando firmas:", this.firmas);
        await this.$api.post("/Firmas", { ...this.firmas, idPartida: this.partidaSeleccionada });
        this.$q.notify({ type: "positive", message: "Firmas guardadas con éxito!" });
        this.cargarFirmas();
      } catch (error) {
        console.error("❌ Error guardando firmas:", error);
        this.$q.notify({ type: "negative", message: "Error al guardar las firmas." });
      }
    },
    obtenerBase64Firma(ref) {
      if (!this.$refs[ref]) return "";
      const signaturePad = this.$refs[ref].saveSignature();
      return signaturePad.isEmpty ? "" : signaturePad.data.replace(/^data:image\/png;base64,/, "");
    },
    cargarFirmaBase64(ref, base64) {
      if (this.$refs[ref] && base64) {
        const signaturePad = this.$refs[ref];
        const imageData = `data:image/png;base64,${base64}`;
        signaturePad.fromDataURL(imageData);
      }
    },
    async actualizarFirmas() {
      if (!this.firmas.idFirma) {
        this.$q.notify({ type: "negative", message: "No hay firma seleccionada para actualizar." });
        return;
      }
      try {
        const data = {
          elaboradoPor: this.firmas.elaboradoPor,
          revisadoPor: this.firmas.revisadoPor,
          aprobadoPor: this.firmas.aprobadoPor,
          firmaElaboradoBase64: this.obtenerBase64Firma("firmaElaborado"),
          firmaRevisadoBase64: this.obtenerBase64Firma("firmaRevisado"),
          firmaAprobadoBase64: this.obtenerBase64Firma("firmaAprobado"),
          idPartida: this.partidaSeleccionada
        };
        await this.$api.put(`/Firmas/${this.firmas.idFirma}`, data);
        this.$q.notify({ type: "positive", message: "Firmas actualizadas con éxito!" });
        this.cargarFirmas();
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Error actualizando firmas." });
      }
    },
    async eliminarFirmas() {
      if (!this.firmas.idFirma) {
        this.$q.notify({ type: "negative", message: "No hay firma seleccionada para eliminar." });
        return;
      }
      try {
        await this.$api.delete(`/Firmas/${this.firmas.idFirma}`);
        this.$q.notify({ type: "positive", message: "Firmas eliminadas con éxito!" });
        this.firmas = { elaboradoPor: null, revisadoPor: null, aprobadoPor: null };
        this.firmaElaboradoImg = this.firmaRevisadoImg = this.firmaAprobadoImg = null;
        if (this.$refs.firmaElaborado) this.$refs.firmaElaborado.clearSignature();
        if (this.$refs.firmaRevisado) this.$refs.firmaRevisado.clearSignature();
        if (this.$refs.firmaAprobado) this.$refs.firmaAprobado.clearSignature();
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Error eliminando firmas." });
      }
    }
  },
  mounted() {
    this.cargarClientes();
    this.cargarTrabajadores();
  }
};
</script>
