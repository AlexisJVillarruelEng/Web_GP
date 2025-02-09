<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6">Firmas de Partida</div>
    </q-card-section>

    <!-- 🔹 Selección de Cliente, Proyecto, Obra y Partida -->
    <q-card-section>
      <q-select v-model="clienteSeleccionado" :options="clientes" option-value="idCliente" option-label="nombreCliente"
        label="Seleccionar Cliente" outlined dense emit-value map-options @update:model-value="cargarProyectos" />
      <q-select v-model="proyectoSeleccionado" :options="proyectos" option-value="idProyecto"
        option-label="nombreProyecto" label="Seleccionar Proyecto" outlined dense emit-value map-options
        @update:model-value="cargarObras" />
      <q-select v-model="obraSeleccionada" :options="obras" option-value="idObra" option-label="nombreObra"
        label="Seleccionar Obra" outlined dense emit-value map-options @update:model-value="cargarPartidas" />
      <q-select v-model="partidaSeleccionada" :options="partidas" option-value="idPartida" option-label="nombrePartida"
        label="Seleccionar Partida" outlined dense emit-value map-options @update:model-value="cargarFirmas" />
    </q-card-section>

    <!-- 🔹 Firmas -->
    <q-card-section v-if="partidaSeleccionada">
      <div class="text-subtitle1">Firmas para la partida seleccionada</div>

      <q-banner v-if="firmasExistentes" class="q-mb-md text-positive">
        <q-icon name="check_circle" color="positive" />
        Esta partida ya tiene firmas registradas.
      </q-banner>

      <div class="firma-container">
        <div class="firma-box">
          <q-select v-model="firmas.elaboradoPor" :options="trabajadores" option-value="nombre"
            option-label="nombre" label="Elaborado Por" outlined dense emit-value map-options />
          <vue-signature-pad ref="firmaElaborado" width="300px" height="150px" class="firma-canvas" />
          <q-btn color="negative" label="Borrar" @click="borrarFirma('firmaElaborado')" />
        </div>

        <div class="firma-box">
          <q-select v-model="firmas.revisadoPor" :options="trabajadores" option-value="nombre"
            option-label="nombre" label="Revisado Por" outlined dense emit-value map-options />
          <vue-signature-pad ref="firmaRevisado" width="300px" height="150px" class="firma-canvas" />
          <q-btn color="negative" label="Borrar" @click="borrarFirma('firmaRevisado')" />
        </div>

        <div class="firma-box">
          <q-select v-model="firmas.aprobadoPor" :options="trabajadores" option-value="nombre"
            option-label="nombre" label="Aprobado Por" outlined dense emit-value map-options />
          <vue-signature-pad ref="firmaAprobado" width="300px" height="150px" class="firma-canvas" />
          <q-btn color="negative" label="Borrar" @click="borrarFirma('firmaAprobado')" />
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
  components: {
    VueSignaturePad
  },
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
      firmas: {
        elaboradoPor: null,
        revisadoPor: null,
        aprobadoPor: null,
        firmaElaboradoBase64: "",
        firmaRevisadoBase64: "",
        firmaAprobadoBase64: ""
      }
    };
  },
  methods: {
    async cargarClientes() { this.clientes = (await this.$api.get("/Clientes")).data; },
    async cargarProyectos() { this.proyectos = (await this.$api.get(`/Proyectos/PorCliente/${this.clienteSeleccionado}`)).data; },
    async cargarObras() { this.obras = (await this.$api.get(`/Obras/PorProyecto/${this.proyectoSeleccionado}`)).data; },
    async cargarPartidas() { this.partidas = (await this.$api.get(`/Partidas/PorObra/${this.obraSeleccionada}`)).data; },
    async cargarTrabajadores() { this.trabajadores = (await this.$api.get("/Trabajadores")).data; },

    async cargarFirmas() {
      if (!this.partidaSeleccionada) return;

      try {
        const response = await this.$api.get(`/Firmas/Matriz/${this.partidaSeleccionada}`);
        const firmaData = response.data[0]; // Extraer el primer objeto del array
        this.firmasExistentes = !!firmaData;

        console.log("✅ Firmas recuperadas:", firmaData);

        if (firmaData) {
          // Asignar los nombres de los trabajadores
          this.firmas.elaboradoPor = firmaData.nombreElaboradoPor;
          this.firmas.revisadoPor = firmaData.nombreRevisadoPor;
          this.firmas.aprobadoPor = firmaData.nombreAprobadoPor;

          // Cargar firmas en los SignaturePad
          this.cargarFirmaBase64("firmaElaborado", firmaData.firmaElaboradoUrl);
          this.cargarFirmaBase64("firmaRevisado", firmaData.firmaRevisadoUrl);
          this.cargarFirmaBase64("firmaAprobado", firmaData.firmaAprobadoUrl);
        }

      } catch (error) {
        console.warn("⚠️ No hay firmas registradas para esta partida.");
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
        console.log("📤 Enviando firmas:", this.firmas);
        await this.$api.post("/Firmas", { ...this.firmas, idPartida: this.partidaSeleccionada });

        this.$q.notify({ type: "positive", message: "Firmas guardadas con éxito!" });
        this.cargarFirmas();
      } catch (error) {
        console.error("❌ Error guardando firmas:", error);
        this.$q.notify({ type: "negative", message: "Error al guardar las firmas." });
      }
    },

    cargarFirmaBase64(ref, base64) {
      if (this.$refs[ref] && base64) {
        const signaturePad = this.$refs[ref];
        const imageData = `data:image/png;base64,${base64}`;
        signaturePad.fromDataURL(imageData);
      }
    },

    borrarFirma(ref) {
      if (this.$refs[ref]) this.$refs[ref].clearSignature();
    }
  },
  mounted() {
    this.cargarClientes();
    this.cargarTrabajadores();
  }
};
</script>
