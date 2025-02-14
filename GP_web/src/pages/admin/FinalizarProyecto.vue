<template>
  <q-page class="q-pa-md flex flex-center">
    <div class="text-h5 text-center q-mb-md">Finalización de Proyectos</div>

    <!-- ✅ Filtros -->
    <div class="filtro-container">
      <q-input v-model="filtro.query" label="Buscar" outlined dense>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-input v-model="filtro.fechaInicio" label="Fecha Inicio" outlined dense type="date" />
      <q-input v-model="filtro.fechaFin" label="Fecha Fin" outlined dense type="date" />
    </div>

    <!-- 📋 Lista de Proyectos -->
    <div class="proyectos-container">
      <q-card v-for="proyecto in proyectosFiltrados" :key="proyecto.idProyecto" class="proyecto-card">
        <q-card-section>
          <div class="text-subtitle1">Nombre del Proyecto</div>
          <q-input v-model="proyecto.nombreProyecto" disable outlined dense />

          <div class="text-subtitle1">Cliente</div>
          <q-input v-model="proyecto.nombreCliente" disable outlined dense />

          <div class="text-subtitle1">Fecha Inicio</div>
          <q-input :model-value="formatearFecha(proyecto.fechaInicio)" disable outlined dense />

          <div class="text-subtitle1">Fecha Fin</div>
          <q-tooltip>
            Fecha se actualiza al dar a finalizar el proyecto".
          </q-tooltip>
          <q-input :model-value="formatearFecha(proyecto.fechaFin)" disable outlined dense />

          <q-btn color="negative" label="Finalizar Proyecto" class="q-mt-md full-width" @click="finalizarProyecto(proyecto)" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "FinalizarProyectos",
  data() {
    return {
      proyectos: [],
      filtro: {
        query: "",
        fechaInicio: "",
        fechaFin: ""
      },
    };
  },
  computed: {
    proyectosFiltrados() {
      return this.proyectos.filter(proyecto => {
        const query = this.filtro.query.toLowerCase();
        const fechaInicio = this.filtro.fechaInicio ? new Date(this.filtro.fechaInicio) : null;
        const fechaFin = this.filtro.fechaFin ? new Date(this.filtro.fechaFin) : null;
        const fechaProyecto = new Date(proyecto.fechaInicio);

        const cumpleBusqueda =
          proyecto.nombreProyecto?.toLowerCase().includes(query) ||
          proyecto.nombreCliente?.toLowerCase().includes(query);

        const cumpleFecha =
          (!fechaInicio || fechaProyecto >= fechaInicio) &&
          (!fechaFin || fechaProyecto <= fechaFin);

        return cumpleBusqueda && cumpleFecha && proyecto.estado;
      });
    }
  },
  methods: {
    async cargarProyectos() {
      try {
        console.log("📢 Cargando proyectos desde API...");
        const response = await this.$api.get("/Proyectos");
        console.log("✅ Datos recibidos:", response.data);

        this.proyectos = response.data.map(proyecto => ({
          ...proyecto
        }));
      } catch (error) {
        console.error("❌ Error al cargar proyectos:", error);
      }
    },

    async finalizarProyecto(proyecto) {
      try {
        console.log(`🚀 Actualizando fecha de finalización para el proyecto ID: ${proyecto.idProyecto}`);
        const fechaActual = new Date().toISOString().split("T")[0];

        await this.$api.put(`/Proyectos/${proyecto.idProyecto}`, {
          ...proyecto,
          fechaFin: fechaActual
        });

        console.log(`🚀 Finalizando proyecto ID: ${proyecto.idProyecto}`);
        await this.$api.delete(`/Proyectos/logical/${proyecto.idProyecto}`);

        this.$q.notify({ type: "positive", message: "✅ Proyecto finalizado correctamente." });
        this.cargarProyectos();
      } catch (error) {
        console.error("❌ Error al finalizar proyecto:", error);
        this.$q.notify({ type: "negative", message: "Error al finalizar el proyecto." });
      }
    },

    formatearFecha(fecha) {
      if (!fecha) return "";
      const fechaObj = new Date(fecha);
      const dia = fechaObj.getDate().toString().padStart(2, "0");
      const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
      const año = fechaObj.getFullYear();
      return `${dia}/${mes}/${año}`;
    }
  },
  mounted() {
    this.cargarProyectos();
  }
};
</script>

<style scoped>
.q-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.filtro-container {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.proyectos-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.proyecto-card {
  width: 320px;
  padding: 16px;
  border-radius: 10px;
  background: white;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
