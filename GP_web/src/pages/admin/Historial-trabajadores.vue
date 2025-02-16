<template>
  <q-page class="q-col-gutter-md">
    <div class="text-h5 text-center q-mb-md">Historial de Trabajadores</div>

    <!-- Filtro de búsqueda, estado y fecha -->
    <AdminFiltroFechaEstadoBusqueda @filtrar="aplicarFiltros" />

    <!-- Tabla de Trabajadores -->
    <q-table
      :rows="trabajadoresFiltrados"
      :columns="columnas"
      row-key="idTrabajador"
      dense
      class="tabla-estilizada"
      :pagination="paginacion"
    />
  </q-page>
</template>

<script>
import AdminFiltroFechaEstadoBusqueda from "components/admin/admin-filtro-fecha-estado-busqueda.vue";

export default {
  name: "HistorialTrabajadores",
  components: { AdminFiltroFechaEstadoBusqueda },
  data() {
    return {
      trabajadores: [],
      filtro: {
        query: "",
        fecha: "",
        estado: "Todos"
      },
      paginacion: {
        rowsPerPage: 20,
      },
      columnas: [
        { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
        { name: "apellido", label: "Apellido", field: "apellido", align: "left" },
        { name: "dni", label: "DNI", field: "dni", align: "left" },
        { name: "correo", label: "Correo", field: "correo", align: "left" },
        {
          name: "fechaCreacion",
          label: "Fecha Creación",
          field: "fechaCreacion",
          align: "left",
          format: val => val ? this.formatearFecha(val) : ""
        },
        {
          name: "estado",
          label: "Estado",
          field: row => (row.estado ? "Activo" : "Inactivo"),
          align: "left"
        }
      ]
    };
  },
  computed: {
    trabajadoresFiltrados() {
      return this.trabajadores.filter(trabajador => {
        const query = this.filtro.query.toLowerCase();
        const estadoTexto = trabajador.estado ? "Activo" : "Inactivo";

        const cumpleBusqueda = query
          ? (
              (trabajador.nombre && trabajador.nombre.toLowerCase().includes(query)) ||
              (trabajador.apellido && trabajador.apellido.toLowerCase().includes(query)) ||
              (trabajador.dni && trabajador.dni.toLowerCase().includes(query)) ||
              (trabajador.correo && trabajador.correo.toLowerCase().includes(query))
            )
          : true;

        // Se utiliza la función compararFechas para comparar la fecha del trabajador con el filtro
        const cumpleFecha = this.filtro.fecha
          ? this.compararFechas(trabajador.fechaCreacion, this.filtro.fecha)
          : true;

        const cumpleEstado = this.filtro.estado === "Todos" || estadoTexto === this.filtro.estado;

        return cumpleBusqueda && cumpleFecha && cumpleEstado;
      });
    }
  },
  methods: {
    async fetchTrabajadores() {
      try {
        console.log("📢 Cargando trabajadores desde API...");
        const response = await this.$api.get(`/Trabajadores?incluirInactivos=true`);
        console.log("✅ Datos recibidos de la API:", response.data);
        // Asumimos que la fecha puede venir en diferentes formatos; usamos formatearFecha
        this.trabajadores = response.data.map(trabajador => ({
          ...trabajador,
          fechaCreacion: trabajador.fechaCreacion
            ? this.formatearFecha(trabajador.fechaCreacion)
            : ""
        }));
        console.log("📊 Trabajadores procesados:", this.trabajadores);
      } catch (error) {
        console.error("❌ Error cargando trabajadores:", error);
      }
    },
    aplicarFiltros(filtro) {
      console.log("⚡ Aplicando filtros:", filtro);
      this.filtro = filtro;
    },
    formatearFecha(fecha) {
      if (!fecha) return "";
      // Si ya viene en formato "DD/MM/YYYY", se retorna tal cual.
      if (typeof fecha === "string" && fecha.includes("/")) {
        return fecha;
      }
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        console.warn("No se puede parsear la fecha:", fecha);
        return "Fecha inválida";
      }
      // Formatear en UTC para evitar desfases
      const options = { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" };
      return fechaObj.toLocaleDateString("es-PE", options);
    },
    // Función auxiliar para parsear fecha en formato DD/MM/YYYY
    parseDDMMYYYY(dateStr) {
      const parts = dateStr.split("/");
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(Date.UTC(year, month, day));
    },
    compararFechas(fechaTrabajador, fechaFiltro) {
      if (!fechaTrabajador || !fechaFiltro) return false;
      let dtTrabajador, dtFiltro;
      // Si la fecha viene en formato "DD/MM/YYYY", la parseamos
      if (fechaTrabajador.includes("/")) {
        dtTrabajador = this.parseDDMMYYYY(fechaTrabajador);
      } else {
        dtTrabajador = new Date(fechaTrabajador);
      }
      if (fechaFiltro.includes("/")) {
        dtFiltro = this.parseDDMMYYYY(fechaFiltro);
      } else {
        dtFiltro = new Date(fechaFiltro);
      }
      if (!dtTrabajador || isNaN(dtTrabajador.getTime()) || isNaN(dtFiltro.getTime())) {
        return false;
      }
      return dtTrabajador <= dtFiltro;
    }
  },
  mounted() {
    this.fetchTrabajadores();
  }
};
</script>

<style scoped>
.q-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0;
}

.filtro-container {
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
}

.tabla-container {
  width: 100%;
  max-width: 1000px;
}

.tabla-estilizada {
  width: 80%;
  border-radius: 8px;
  overflow: hidden;
}
</style>
