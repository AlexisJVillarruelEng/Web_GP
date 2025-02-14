<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6 text-center">Historial de Proyectos</div>
    </q-card-section>

    <!-- 🔹 Búsqueda y Filtros -->
    <q-card-section class="row justify-center q-gutter-md">
      <q-input v-model="search" debounce="300" placeholder="Buscar proyecto o cliente" filled dense class="filter-input">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-select v-model="filtroEstado" :options="estados" label="Estado" outlined dense class="filter-input" emit-value map-options />
      <q-input v-model="fechaInicio" type="date" label="Fecha Inicio" outlined dense class="filter-input" />
      <q-input v-model="fechaFin" type="date" label="Fecha Fin Probable" outlined dense class="filter-input" />
    </q-card-section>

    <!-- 🔹 Lista de Proyectos -->
    <q-card-section class="row justify-center q-gutter-md">
      <q-card v-for="proyecto in proyectosFiltrados" :key="proyecto.idProyecto" class="q-pa-md project-card">
        <q-card-section>
          <div class="text-subtitle1">Nombre del Proyecto</div>
          <q-input :model-value="proyecto.nombreProyecto" readonly filled dense />
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1">Cliente</div>
          <q-input :model-value="proyecto.nombreCliente" readonly filled dense />
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1">Fecha Inicio</div>
          <q-input :model-value="formatearFecha(proyecto.fechaInicio)" readonly filled dense />
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1">Fecha Fin Probable</div>
          <q-input :model-value="formatearFecha(proyecto.fechaFin)" readonly filled dense />
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1">Estado</div>
          <q-chip :color="proyecto.estado ? 'positive' : 'negative'" dark>
            {{ proyecto.estado ? 'Activo' : 'Inactivo' }}
          </q-chip>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      filtroEstado: "Activo",
      fechaInicio: "",
      fechaFin: "",
      estados: ["Activo", "Inactivo"],
      proyectos: []
    };
  },
  computed: {
    proyectosFiltrados() {
      return this.proyectos.filter(proyecto => {
        const matchesSearch =
          (proyecto.nombreProyecto?.toLowerCase() || "").includes(this.search.toLowerCase()) ||
          (proyecto.nombreCliente?.toLowerCase() || "").includes(this.search.toLowerCase());

        const estadoProyecto = Boolean(proyecto.estado);
        const matchesEstado = this.filtroEstado === "Activo" ? estadoProyecto : !estadoProyecto;

        const matchesFechaInicio = this.fechaInicio ? new Date(proyecto.fechaInicio) >= new Date(this.fechaInicio) : true;
        const matchesFechaFin = this.fechaFin ? new Date(proyecto.fechaFin) <= new Date(this.fechaFin) : true;

        return matchesSearch && matchesEstado && matchesFechaInicio && matchesFechaFin;
      });
    }
  },
  async mounted() {
    await this.cargarProyectos();
  },
  methods: {
    async cargarProyectos() {
      try {
        const response = await this.$api.get("/Proyectos?incluirInactivos=true");
        this.proyectos = response.data.map(p => ({
          idProyecto: p.idProyecto,
          nombreProyecto: p.nombreProyecto,
          nombreCliente: p.nombreCliente,
          fechaInicio: p.fechaInicio,
          fechaFin: p.fechaFin,
          estado: p.estado
        }));
        console.log("✅ Proyectos cargados:", this.proyectos);
      } catch (error) {
        console.error("❌ Error cargando proyectos", error);
      }
    },
    formatearFecha(fecha) {
      if (!fecha) return "";
      const fechaObj = new Date(fecha + "T00:00:00"); // Evita desfase de zona horaria
      const dia = fechaObj.getUTCDate().toString().padStart(2, "0");
      const mes = (fechaObj.getUTCMonth() + 1).toString().padStart(2, "0");
      const año = fechaObj.getUTCFullYear();
      return `${dia}/${mes}/${año}`; // Formato DD/MM/AAAA
    }
  }
};
</script>

<style scoped>
.q-card {
  max-width: 1500px;
  margin: auto;
}
.q-input,
.q-select {
  width: 100%;
}
.filter-input {
  width: 250px;
}
.project-card {
  margin: 40px;
  width: 350px;
  min-width: 300px;
  text-align: center;
}
.q-card-section {
  text-align: center;
}
</style>
