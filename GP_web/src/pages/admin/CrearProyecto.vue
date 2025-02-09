<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-center q-mb-md">Crear Proyecto</div>

    <!-- 🔹 Tabs para navegar entre las secciones -->
    <q-tabs v-model="tab" class="q-mb-md">
      <q-tab name="proyecto" label="Crear Proyecto" />
      <q-tab name="procesos" label="Procesos" />
      <q-tab name="tareas" label="Tareas" />
      <q-tab name="iperc" label="Detalle IPERC" />
      <q-tab name="firmas" label="Firmas" />
    </q-tabs>

    <!-- 🔹 Panel de contenido basado en la pestaña activa -->
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="proyecto">
        <!-- 📌 Formulario para crear proyecto -->
        <FormProyecto @guardarProyecto="guardarProyecto" />

        <!-- 📌 Formulario para agregar obras -->
        <FormObra
          v-if="proyectoSeleccionado"
          :proyectoId="proyectoSeleccionado"
          @obrasGuardadas="cargarObras"
        />

        <!-- 📌 Formulario para agregar partidas -->
        <FormPartida
          v-if="proyectoSeleccionado && obras.length > 0"
          :proyectoId="proyectoSeleccionado"
          :obras="obras"
        />
      </q-tab-panel>

      <!--- 📌 Formulario para agregar procesos -->

      <q-tab-panel name="procesos">
        <FormProcesos />
      </q-tab-panel>
      <!--- 📌 Formulario para agregar tareas -->
      <q-tab-panel name="tareas">
        <FormTareas />
      </q-tab-panel>
      <!--- 📌 Formulario para agregar detalle IPERC -->
      <q-tab-panel name="iperc">
        <FormDetalleIPERC />
      </q-tab-panel>

      <q-tab-panel name="firmas">
        <FormFirmas />
      </q-tab-panel>


    </q-tab-panels>
  </q-page>
</template>

<script>
import FormProyecto from "components/admin/form-proyecto.vue";
import FormObra from "components/admin/form-obra.vue";
import FormPartida from "components/admin/form-partida.vue";
import FormProcesos from "src/components/admin/form-procesos.vue";
import FormTareas from "src/components/admin/form-tarea.vue";
import FormDetalleIPERC from "src/components/admin/form-detalleiperc.vue";
import formFirmas from "src/components/admin/form-firmas.vue";
import FormFirmas from "src/components/admin/form-firmas.vue";



export default {
  name: "CrearProyecto",
  components: {
    FormProyecto,
    FormObra,
    FormPartida,
    FormProcesos,
    FormTareas,
    FormDetalleIPERC,
    FormFirmas
  },
  data() {
    return {
      tab: "proyecto",
      proyectoSeleccionado: null, // ID del proyecto seleccionado
      obras: [] // Lista de obras asociadas al proyecto
    };
  },
  methods: {
    // 📌 Se ejecuta cuando se guarda un proyecto
    guardarProyecto(proyectoId) {
      if (!proyectoId) {
        console.error("⚠️ Error: Proyecto guardado sin ID válido.");
        return;
      }

      console.log("📌 Proyecto guardado con ID:", proyectoId);
      this.proyectoSeleccionado = proyectoId;
    },

    // 📌 Se ejecuta cuando se guardan obras
    async cargarObras() {
      if (!this.proyectoSeleccionado) {
        console.error("⚠️ Error: No hay proyecto seleccionado para cargar obras.");
        return;
      }

      try {
        console.log("🔄 Cargando obras asociadas al proyecto:", this.proyectoSeleccionado);
        const response = await this.$api.get(`/Obras/PorProyecto/${this.proyectoSeleccionado}`);

        this.obras = response.data;
        console.log("✅ Obras cargadas:", this.obras);

      } catch (error) {
        console.error("❌ Error cargando obras:", error);
      }
    }
  }
};
</script>
