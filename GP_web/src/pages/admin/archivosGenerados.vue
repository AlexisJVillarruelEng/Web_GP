<template>
  <q-page padding class="q-col-gutter-md">
    <!-- 1. SELECTORES: Cliente, Proyecto, Obra, Partida -->
    <q-card class="q-pa-md q-mb-md">
      <q-card-section>
        <div class="text-h6">Seleccionar Cliente, Proyecto, Obra, Partida</div>
      </q-card-section>
      <q-card-section class="row q-col-gutter-md">
        <!-- Cliente -->
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
          class="col-3"
          @update:model-value="cargarProyectos"
        />
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
          class="col-3"
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
          class="col-3"
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
          class="col-3"
          @update:model-value="cargarMatrizCompleta"
        />
      </q-card-section>
    </q-card>

    <!-- 2. MATRIZ IPERC: Procesos, Tareas, Detalles y Firmas -->
    <q-card v-if="matrizIperc" class="q-pa-md q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">Matriz IPERC de la Partida {{ partidaSeleccionada }}</div>
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

    <!-- 3. DESCARGAS -->
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Descargar Archivos</div>
      </q-card-section>
      <q-card-section class="row q-col-gutter-md">
        <!-- Descarga por ID -->
        <q-input
          v-model="idArchivoFilter"
          label="Descargar por ID de Archivo"
          outlined
          dense
          class="col-3"
        />
        <q-btn label="Descargar (ID)" color="primary" @click="descargarArchivoPorId" />
        <!-- Descarga por Proyecto (nota: asegúrate de que 'proyectoParaDescarga' sea solo el ID) -->
        <q-select
          v-model="proyectoParaDescarga"
          :options="proyectosDescarga"
          option-value="idProyecto"
          option-label="nombreProyecto"
          label="Descargar por Proyecto"
          outlined
          dense
          class="col-3"
          emit-value
          map-options
        />
        <q-btn label="Descargar Archivos del Proyecto" color="primary" @click="descargarArchivosProyecto" />
        <!-- Descarga por Carpeta -->
        <q-input
          v-model="carpetaFilter"
          label="Descargar por Carpeta"
          outlined
          dense
          class="col-3"
        />
        <q-btn label="Descargar Archivos de la Carpeta" color="primary" @click="descargarArchivosCarpeta" />
      </q-card-section>
    </q-card>

    <!-- 4. LISTA DE ARCHIVOS FILTRADOS -->
    <q-card class="q-pa-md q-mt-md">
      <q-card-section>
        <div class="text-h6">Lista de Archivos Filtrados</div>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="archivosFiltrados"
          :columns="columnasArchivos"
          row-key="idArchivo"
          dense
          title="Archivos Encontrados"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td>{{ props.row.idArchivo }}</q-td>
              <q-td>{{ props.row.nombreArchivo }}</q-td>
              <q-td>{{ props.row.carpeta }}</q-td>
              <q-td>
                <q-btn label="Descargar" color="primary" @click="descargarArchivo(props.row)" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- 5. FORMULARIO: ARCHIVO GENERADO (Reporte) -->
    <q-card class="q-pa-md q-mt-md">
      <q-card-section>
        <div class="text-h6">Datos para Archivo Generado</div>
      </q-card-section>
      <q-card-section class="row q-col-gutter-md">
        <q-input
          v-model="archivoPost.nombreArchivo"
          label="Nombre del Archivo"
          outlined
          dense
          class="col-3"
        />
        <q-input
          v-model="archivoPost.generadoPor"
          label="Generado por"
          outlined
          dense
          class="col-3"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Generar y Guardar" color="primary" @click="crearArchivoGenerado" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default {
  name: "ArchivosGeneradosManager",
  data() {
    return {
      // SELECTORES
      clienteSeleccionado: null,
      proyectoSeleccionado: null,
      obraSeleccionada: null,
      partidaSeleccionada: null,
      clientes: [],
      proyectos: [],
      obras: [],
      partidas: [],
      proyectosDescarga: [],

      // MATRIZ IPERC
      matrizIperc: null,
      columnasProcesos: [
        { name: "idProceso", label: "ID Proceso", field: "idProceso" },
        { name: "nombreProceso", label: "Nombre Proceso", field: "nombreProceso" },
        { name: "tareas", label: "Tareas", field: "tareas" }
      ],
      columnasDetalles: [
        { name: "idDetalle", label: "ID Detalle", field: "idDetalle", align: "center" },
        { name: "descPeligros", label: "Peligros", field: "descPeligros" },
        { name: "tipoPeligro", label: "Tipo Peligro", field: "tipoPeligro", align: "center" },
        { name: "riesgos", label: "Riesgo", field: "riesgos" },
        { name: "tipoRiesgo", label: "Tipo Riesgo", field: "tipoRiesgo", align: "center" },
        {
          name: "medidaControlDescrip",
          label: "Medida Control",
          field: "medidaControlDescrip",
          style: "max-width: 300px; white-space: normal;",
          classes: "text-wrap"
        },
        { name: "personasExpuestas", label: "Pers. Exp.", field: "personasExpuestas", align: "center" },
        { name: "procedimientosExistentes", label: "Proc. Exist.", field: "procedimientosExistentes", align: "center" },
        { name: "capacitacion", label: "Capac.", field: "capacitacion", align: "center" },
        { name: "expoRiesgo", label: "Expo. Riesgo", field: "expoRiesgo", align: "center" },
        { name: "probabilidad", label: "Probab.", field: "probabilidad", align: "center" },
        { name: "severidad", label: "Sever.", field: "severidad", align: "center" },
        { name: "nivielDeRiesgo", label: "Nivel Riesgo", field: "nivielDeRiesgo", align: "center" },
        { name: "gradoRiesgo", label: "Grado Riesgo", field: "gradoRiesgo", align: "center" }
      ],
      firmaElaboradoImg: null,
      firmaRevisadoImg: null,
      firmaAprobadoImg: null,
      firmasExistentes: false,

      // DESCARGAS
      idArchivoFilter: "",
      carpetaFilter: "",
      archivosFiltrados: [],
      columnasArchivos: [
        { name: "idArchivo", label: "ID Archivo", field: "idArchivo" },
        { name: "nombreArchivo", label: "Nombre", field: "nombreArchivo" },
        { name: "carpeta", label: "Carpeta", field: "carpeta" },
        { name: "acciones", label: "Acciones" }
      ],

      // FORMULARIO ARCHIVO GENERADO
      archivoPost: {
        nombreArchivo: "",
        generadoPor: "",
        carpeta: "Matriz",
        tablaRelacion: "matriz"
      },

      // Mapa de trabajadores: idTrabajador -> nombre
      workerMap: {}
    };
  },
  methods: {
    /* CARGA DE SELECTORES */
    async cargarClientes() {
      try {
        const resp = await this.$api.get("/Clientes");
        this.clientes = resp.data;
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    },
    async cargarProyectos() {
      if (!this.clienteSeleccionado) return;
      try {
        const resp = await this.$api.get(`/Proyectos/PorCliente/${this.clienteSeleccionado}`);
        this.proyectos = resp.data;
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

    /* CARGA DE MATRIZ IPERC */
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
          this.firmasExistentes = true;
          if (this.matrizIperc.firmas.firmaElaboradoBase64) {
            this.firmaElaboradoImg = "data:image/png;base64," + this.matrizIperc.firmas.firmaElaboradoBase64;
          }
          if (this.matrizIperc.firmas.firmaRevisadoBase64) {
            this.firmaRevisadoImg = "data:image/png;base64," + this.matrizIperc.firmas.firmaRevisadoBase64;
          }
          if (this.matrizIperc.firmas.firmaAprobadoBase64) {
            this.firmaAprobadoImg = "data:image/png;base64," + this.matrizIperc.firmas.firmaAprobadoBase64;
          }
        } else {
          this.firmasExistentes = false;
        }
      } catch (error) {
        console.error("Error al cargar la matriz IPERC:", error);
      }
    },

    /* DESCARGAS */
    async descargarArchivoPorId() {
      if (!this.idArchivoFilter) {
        this.$q.notify({ type: "negative", message: "Ingrese un ID de Archivo" });
        return;
      }
      try {
        const resp = await this.$api.get(`/ArchivosGenerados/${this.idArchivoFilter}`, { responseType: "blob" });
        const contentDisposition = resp.headers["content-disposition"] || "";
        let fileName = "downloaded_file";
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch != null && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "");
        }
        const fileBlob = new Blob([resp.data], { type: resp.headers["content-type"] });
        const fileURL = window.URL.createObjectURL(fileBlob);
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error al descargar archivo por ID:", error);
      }
    },
    async descargarArchivosProyecto() {
      if (!this.proyectoParaDescarga) {
        this.$q.notify({ type: "negative", message: "Seleccione un proyecto" });
        return;
      }
      try {
        const resp = await this.$api.get(`/ArchivosGenerados/proyecto/${this.proyectoParaDescarga}`, { responseType: "blob" });
        const contentDisposition = resp.headers["content-disposition"] || "";
        let fileName = "downloaded_project_files.zip";
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch != null && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "");
        }
        const fileBlob = new Blob([resp.data], { type: resp.headers["content-type"] });
        const fileURL = window.URL.createObjectURL(fileBlob);
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error al descargar archivos del proyecto:", error);
      }
    },
    async descargarArchivosCarpeta() {
      if (!this.carpetaFilter) {
        this.$q.notify({ type: "negative", message: "Ingrese el nombre de la carpeta" });
        return;
      }
      try {
        const resp = await this.$api.get(`/ArchivosGenerados/carpeta/${this.carpetaFilter}`, { responseType: "blob" });
        const contentDisposition = resp.headers["content-disposition"] || "";
        let fileName = "downloaded_folder_files.zip";
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch != null && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "");
        }
        const fileBlob = new Blob([resp.data], { type: resp.headers["content-type"] });
        const fileURL = window.URL.createObjectURL(fileBlob);
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error al descargar archivos de la carpeta:", error);
      }
    },
    descargarArchivo(row) {
      const url = `/ArchivosGenerados/${row.idArchivo}`;
      // Usamos la misma lógica de descarga
      this.$api.get(url, { responseType: "blob" })
        .then(resp => {
          const contentDisposition = resp.headers["content-disposition"] || "";
          let fileName = "downloaded_file";
          const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (fileNameMatch != null && fileNameMatch[1]) {
            fileName = fileNameMatch[1].replace(/['"]/g, "");
          }
          const fileBlob = new Blob([resp.data], { type: resp.headers["content-type"] });
          const fileURL = window.URL.createObjectURL(fileBlob);
          const link = document.createElement("a");
          link.href = fileURL;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error("Error al descargar archivo de la API:", error);
        });
    },
    async listarArchivos(endpoint) {
      try {
        const resp = await this.$api.get(endpoint);
        this.archivosFiltrados = resp.data;
      } catch (error) {
        console.error("Error listando archivos:", error);
      }
    },

    /* CREAR ARCHIVO GENERADO (Reporte) */
    async crearArchivoGenerado() {
      if (!this.matrizIperc) {
        this.$q.notify({ type: "negative", message: "La matriz IPERC no está cargada." });
        return;
      }
      // Confirmación: PDF si acepta, Excel si cancela
      const isPdf = window.confirm("¿Generar en PDF? (Cancelar = Excel)");
      let formato = isPdf ? "pdf" : "excel";

      try {
        let base64File = "";
        let nombreArchivo = this.archivoPost.nombreArchivo || "Reporte_Matriz";
        if (formato === "pdf") {
          base64File = await this.exportToPDF_IPERC(this.matrizIperc);
          if (!nombreArchivo.toLowerCase().endsWith(".pdf")) {
            nombreArchivo += ".pdf";
          }
        } else {
          base64File = await this.exportToExcel_IPERC(this.matrizIperc);
          if (!nombreArchivo.toLowerCase().endsWith(".xlsx")) {
            nombreArchivo += ".xlsx";
          }
        }
        this.archivoPost.idRelacion = this.proyectoSeleccionado || 0;
        this.archivoPost.tablaRelacion = "matriz";
        this.archivoPost.carpeta = "Matriz";
        this.archivoPost.nombreArchivo = nombreArchivo;
        this.archivoPost.generadoPor = this.archivoPost.generadoPor || "testnombre";
        this.archivoPost.archivo = base64File;

        await this.$api.post("/ArchivosGenerados", this.archivoPost);
        this.$q.notify({ type: "positive", message: "Archivo generado y guardado con éxito" });
        this.listarArchivos("/ArchivosGenerados");
      } catch (error) {
        console.error("Error al generar/guardar el archivo:", error);
        this.$q.notify({ type: "negative", message: "Error al generar el archivo." });
      }
    },

    /* EXPORTAR PDF/EXCEL (CABECERA + TABLA + PIE) */
    async exportToPDF_IPERC(datos) {
      const doc = new jsPDF("p", "pt");
      doc.setFontSize(14);
      // CABECERA
      doc.text(`Cliente: ${this.getClientName(this.clienteSeleccionado)}`, 40, 40);
      doc.text(`Proyecto: ${this.getProjectName(this.proyectoSeleccionado)}`, 40, 60);
      doc.text(`Obra: ${this.getObraName(this.obraSeleccionada)}`, 40, 80);
      doc.text(`Partida: ${this.getPartidaName(this.partidaSeleccionada)}`, 40, 100);
      // TABLA (Procesos, Tareas, Detalles)
      let yPos = 120;
      doc.setFontSize(12);
      if (datos.procesos) {
        datos.procesos.forEach(proc => {
          doc.text(`Proceso #${proc.idProceso}: ${proc.nombreProceso}`, 40, yPos);
          yPos += 20;
          proc.tareas.forEach(tarea => {
            doc.text(`Tarea #${tarea.idTarea}: ${tarea.nombreTarea}`, 60, yPos);
            yPos += 20;
            tarea.detallesIperc.forEach(detail => {
              doc.text(
                `Detalle #${detail.idDetalle} - Peligro: ${detail.descPeligros}, Riesgo: ${detail.riesgos}`,
                80,
                yPos
              );
              yPos += 20;
            });
          });
        });
      }
      // PIE: Firmas (agregando imágenes si están disponibles)
      yPos += 40;
      doc.setFontSize(10);
      if (datos.firmas) {
        if (this.firmaElaboradoImg) {
          doc.text(`Elaborado por: ${this.getWorkerName(datos.firmas.elaboradoPor)}`, 40, yPos);
          doc.addImage(this.firmaElaboradoImg, 'PNG', 250, yPos - 10, 80, 40);
          yPos += 50;
        }
        if (this.firmaRevisadoImg) {
          doc.text(`Revisado por: ${this.getWorkerName(datos.firmas.revisadoPor)}`, 40, yPos);
          doc.addImage(this.firmaRevisadoImg, 'PNG', 250, yPos - 10, 80, 40);
          yPos += 50;
        }
        if (this.firmaAprobadoImg) {
          doc.text(`Aprobado por: ${this.getWorkerName(datos.firmas.aprobadoPor)}`, 40, yPos);
          doc.addImage(this.firmaAprobadoImg, 'PNG', 250, yPos - 10, 80, 40);
          yPos += 50;
        }
      }
      const base64String = doc.output("datauristring").split(",")[1];
      return base64String;
    },
    async exportToExcel_IPERC(datos) {
      const aoa = [
        [`Cliente: ${this.getClientName(this.clienteSeleccionado)}`],
        [`Proyecto: ${this.getProjectName(this.proyectoSeleccionado)}`],
        [`Obra: ${this.getObraName(this.obraSeleccionada)}`],
        [`Partida: ${this.getPartidaName(this.partidaSeleccionada)}`],
        [],
        ["Proceso", "Tarea", "ID_Detalle", "Peligros", "Riesgo", "Probabilidad", "Severidad", "NivelRiesgo", "GradoRiesgo"]
      ];
      if (datos.procesos) {
        datos.procesos.forEach(proc => {
          proc.tareas.forEach(t => {
            t.detallesIperc.forEach(d => {
              aoa.push([
                proc.nombreProceso,
                t.nombreTarea,
                d.idDetalle,
                d.descPeligros,
                d.riesgos,
                d.probabilidad,
                d.severidad,
                d.nivielDeRiesgo,
                d.gradoRiesgo
              ]);
            });
          });
        });
      }
      // Pie: Firmas
      aoa.push([]);
      aoa.push(["Firmas"]);
      if (datos.firmas) {
        aoa.push([`Elaborado por: ${this.getWorkerName(datos.firmas.elaboradoPor)}`]);
        aoa.push([`Revisado por: ${this.getWorkerName(datos.firmas.revisadoPor)}`]);
        aoa.push([`Aprobado por: ${this.getWorkerName(datos.firmas.aprobadoPor)}`]);
      }
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "IPERC");
      return XLSX.write(wb, { bookType: "xlsx", type: "base64" });
    },
    async exportToPDF_Otro(datos) {
      const doc = new jsPDF("p", "pt");
      doc.text(`Reporte: ${this.otroReporteNombre}`, 40, 40);
      doc.autoTable({
        head: [["campo1", "campo2"]],
        body: datos.map(d => [d.campo1, d.campo2]),
        startY: 60
      });
      return doc.output("datauristring").split(",")[1];
    },
    async exportToExcel_Otro(datos) {
      const ws = XLSX.utils.json_to_sheet(datos);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "OtroReporte");
      return XLSX.write(wb, { bookType: "xlsx", type: "base64" });
    },

    /* GETTERS PARA NOMBRES */
    getClientName(idCliente) {
      const c = this.clientes.find(x => x.idCliente === idCliente);
      return c ? c.nombreCliente : "Desconocido";
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
    getWorkerName(idTrabajador) {
      return this.workerMap[idTrabajador] || `ID: ${idTrabajador}`;
    }
  },
  async mounted() {
    // Cargar clientes
    this.cargarClientes();

    // Cargar trabajadores y construir el mapa workerMap
    try {
      const respTrab = await this.$api.get("/Trabajadores");
      for (const w of respTrab.data) {
        this.workerMap[w.idTrabajador] = w.nombre;
      }
    } catch (err) {
      console.error("Error al cargar trabajadores:", err);
    }

    // Cargar proyectos para descargas
    try {
      const respProj = await this.$api.get("/Proyectos");
      this.proyectosDescarga = respProj.data;
    } catch (err) {
      console.error("Error al cargar proyectosDescarga:", err);
    }

    // Listar archivos iniciales
    this.listarArchivos("/ArchivosGenerados");
  }
};
</script>

<style scoped>
.text-wrap {
  white-space: normal;
}
</style>
