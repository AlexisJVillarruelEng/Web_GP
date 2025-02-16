<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6">Firmas de Partida</div>
    </q-card-section>

    <!-- Selección de Cliente, Proyecto, Obra y Partida -->
    <q-card-section>
      <q-select
        v-model="clienteSeleccionado"
        :options="clientes"
        option-value="idCliente"
        option-label="nombreCliente"
        label="Seleccionar Cliente"
        outlined dense
        emit-value map-options
        @update:model-value="cargarProyectos"
      />
      <q-select
        v-model="proyectoSeleccionado"
        :options="proyectos"
        option-value="idProyecto"
        option-label="nombreProyecto"
        label="Seleccionar Proyecto"
        outlined dense
        emit-value map-options
        @update:model-value="cargarObras"
      />
      <q-select
        v-model="obraSeleccionada"
        :options="obras"
        option-value="idObra"
        option-label="nombreObra"
        label="Seleccionar Obra"
        outlined dense
        emit-value map-options
        @update:model-value="cargarPartidas"
      />
      <q-select
        v-model="partidaSeleccionada"
        :options="partidas"
        option-value="idPartida"
        option-label="nombrePartida"
        label="Seleccionar Partida"
        outlined dense
        emit-value map-options
        @update:model-value="cargarFirmas"
      />
    </q-card-section>

    <!-- Firmas -->
    <q-card-section v-if="partidaSeleccionada">
      <div class="text-subtitle1">Firmas para la partida seleccionada</div>

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
            option-value="idTrabajador"
            :option-label="workerLabel"
            label="Elaborado Por"
            outlined dense
            emit-value map-options
          />
          <div v-if="firmaElaboradoImg">
            <img :src="firmaElaboradoImg" alt="Firma Elaborado" style="max-width:300px; max-height:150px;" />
            <q-btn color="negative" label="Borrar" @click="borrarFirma('firmaElaborado')" />
          </div>
          <div v-else>
            <vue-signature-pad ref="firmaElaborado" width="300px" height="150px" class="firma-canvas" />
            <q-btn color="negative" label="Borrar" @click="borrarFirma('firmaElaborado')" />
          </div>
        </div>

        <!-- Firma Revisado -->
        <div class="firma-box">
          <q-select
            v-model="firmas.revisadoPor"
            :options="trabajadores"
            option-value="idTrabajador"
            :option-label="workerLabel"
            label="Revisado Por"
            outlined dense
            emit-value map-options
          />
          <div v-if="firmaRevisadoImg">
            <img :src="firmaRevisadoImg" alt="Firma Revisado" style="max-width:300px; max-height:150px;" />
            <q-btn color="negative" label="Borrar" @click="borrarFirma('firmaRevisado')" />
          </div>
          <div v-else>
            <vue-signature-pad ref="firmaRevisado" width="300px" height="150px" class="firma-canvas" />
            <q-btn color="negative" label="Borrar" @click="borrarFirma('firmaRevisado')" />
          </div>
        </div>

        <!-- Firma Aprobado -->
        <div class="firma-box">
          <q-select
            v-model="firmas.aprobadoPor"
            :options="trabajadores"
            option-value="idTrabajador"
            :option-label="workerLabel"
            label="Aprobado Por"
            outlined dense
            emit-value map-options
          />
          <div v-if="firmaAprobadoImg">
            <img :src="firmaAprobadoImg" alt="Firma Aprobado" style="max-width:300px; max-height:150px;" />
            <q-btn color="negative" label="Borrar" @click="borrarFirma('firmaAprobado')" />
          </div>
          <div v-else>
            <vue-signature-pad ref="firmaAprobado" width="300px" height="150px" class="firma-canvas" />
            <q-btn color="negative" label="Borrar" @click="borrarFirma('firmaAprobado')" />
          </div>
        </div>
      </div>

      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar Firmas" @click="guardarFirmas" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
import { VueSignaturePad } from "vue-signature-pad";

export default {
  name: "FormFirmas",
  components: { VueSignaturePad },
  data() {
    return {
      clienteSeleccionado: null,
      proyectoSeleccionado: null,
      obraSeleccionada: null,
      partidaSeleccionada: null,
      firmasExistentes: false,
      clientes: [],
      proyectos: [],
      obras: [],
      partidas: [],
      trabajadores: [],
      // Objeto para las firmas; los valores para los select serán los ID de trabajadores
      firmas: {
        elaboradoPor: null,
        revisadoPor: null,
        aprobadoPor: null,
        firmaElaboradoBase64: "",
        firmaRevisadoBase64: "",
        firmaAprobadoBase64: ""
      },
      firmaElaboradoImg: null,
      firmaRevisadoImg: null,
      firmaAprobadoImg: null
    };
  },
  methods: {
    async cargarClientes() {
      try {
        const response = await this.$api.get("/Clientes");
        this.clientes = response.data;
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    },
    async cargarProyectos() {
      if (!this.clienteSeleccionado) return;
      try {
        const response = await this.$api.get(`/Proyectos/PorCliente/${this.clienteSeleccionado}`);
        this.proyectos = response.data;
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      }
    },
    async cargarObras() {
      if (!this.proyectoSeleccionado) return;
      try {
        const response = await this.$api.get(`/Obras/PorProyecto/${this.proyectoSeleccionado}`);
        this.obras = response.data;
      } catch (error) {
        console.error("Error cargando obras:", error);
      }
    },
    async cargarPartidas() {
      if (!this.obraSeleccionada) return;
      try {
        const response = await this.$api.get(`/Partidas/PorObra/${this.obraSeleccionada}`);
        this.partidas = response.data;
      } catch (error) {
        console.error("Error cargando partidas:", error);
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
    async cargarFirmas() {
      if (!this.partidaSeleccionada) return;
      try {
        const response = await this.$api.get(`/Firmas/Matriz/${this.partidaSeleccionada}`);
        const firmaData = response.data[0]; // Extraer el primer objeto del array
        this.firmasExistentes = !!firmaData;
        console.log("Firmas recuperadas:", firmaData);
        if (firmaData) {
          // Dado que la API devuelve los nombres de los firmantes, se realiza una búsqueda en la lista de trabajadores
          this.firmas.elaboradoPor = this.trabajadores.find(t => t.nombre === firmaData.nombreElaboradoPor)?.idTrabajador || null;
          this.firmas.revisadoPor = this.trabajadores.find(t => t.nombre === firmaData.nombreRevisadoPor)?.idTrabajador || null;
          this.firmas.aprobadoPor = this.trabajadores.find(t => t.nombre === firmaData.nombreAprobadoPor)?.idTrabajador || null;
          // Cargar las imágenes en los signature-pad
          this.cargarFirmaBase64("firmaElaborado", firmaData.firmaElaboradoUrl);
          this.cargarFirmaBase64("firmaRevisado", firmaData.firmaRevisadoUrl);
          this.cargarFirmaBase64("firmaAprobado", firmaData.firmaAprobadoUrl);
        }
      } catch (error) {
        console.warn("No hay firmas registradas para esta partida.", error);
        this.firmasExistentes = false;
      }
    },
    obtenerBase64Firma(ref) {
      if (!this.$refs[ref]) return "";
      const signaturePad = this.$refs[ref].saveSignature();
      return signaturePad.isEmpty ? "" : signaturePad.data.replace(/^data:image\/png;base64,/, "");
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
        console.log("Enviando firmas:", this.firmas);
        await this.$api.post("/Firmas", { ...this.firmas, idPartida: this.partidaSeleccionada });
        this.$q.notify({ type: "positive", message: "Firmas guardadas con éxito!" });
        this.cargarFirmas();
      } catch (error) {
        console.error("Error guardando firmas:", error);
        this.$q.notify({ type: "negative", message: "Error al guardar las firmas." });
      }
    },
    cargarFirmaBase64(ref, base64) {
      if (this.$refs[ref] && base64) {
        const imageData = `data:image/png;base64,${base64}`;
        this.$nextTick(() => {
          this.$refs[ref].fromDataURL(imageData);
          console.log(`Firma cargada en ${ref}`);
        });
      }
    },
    borrarFirma(ref) {
      if (this.$refs[ref]) this.$refs[ref].clearSignature();
    },
    // Función para formatear la etiqueta en los selectores de trabajadores
    workerLabel(option) {
      return option && option.idTrabajador && option.nombre
        ? `${option.idTrabajador} - ${option.nombre}`
        : "";
    }
  },
  mounted() {
    this.cargarClientes();
    this.cargarTrabajadores();
  }
};
</script>

<style scoped>
.firma-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.firma-box {
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.firma-canvas {
  border: 1px solid #000;
  margin-bottom: 10px;
}
</style>
