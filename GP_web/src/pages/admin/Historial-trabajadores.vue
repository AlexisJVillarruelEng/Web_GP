<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-center q-mb-md">Historial de Trabajadores</div>

    <!-- ✅ Filtro de búsqueda, estado y fecha -->
    <AdminFiltroFechaEstadoBusqueda @filtrar="aplicarFiltros" />

    <!-- 📋 Tabla de Trabajadores -->
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
      trabajadores: [], // Lista de trabajadores
      filtro: {
        query: "",
        fecha: "",
        estado: "Todos" // Estado como string en lugar de booleano
      },
      paginacion:{
        rowsPerPage: 20,
      },

      columnas: [
        { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
        { name: "apellido", label: "Apellido", field: "apellido", align: "left" },
        { name: "dni", label: "DNI", field: "dni", align: "left" },
        { name: "correo", label: "Correo", field: "correo", align: "left" },
        { name: "fechaCreacion", label: "Fecha Creación", field: "fechaCreacion", align: "left", format: val => val ? new Date(val).toLocaleDateString() : "" },
        { name: "estado", label: "Estado", field: row => (row.estado ? "Activo" : "Inactivo"), align: "left" }
      ]
    };
  },

  computed: {
    trabajadoresFiltrados() {
      return this.trabajadores.filter(trabajador => {
        const query = this.filtro.query.toLowerCase();
        const estadoTexto = trabajador.estado ? "Activo" : "Inactivo"; // Convertimos el estado a texto

        // 🔥 **Filtrar por nombre, apellido, DNI, correo**
        const cumpleBusqueda = query
          ? (trabajador.nombre?.toLowerCase().includes(query) || "") ||
            (trabajador.apellido?.toLowerCase().includes(query) || "") ||
            (trabajador.dni?.toLowerCase().includes(query) || "") ||
            (trabajador.correo?.toLowerCase().includes(query) || "")
          : true;

        // 🔥 **Filtrar por fecha**
        const cumpleFecha = this.filtro.fecha
          ? trabajador.fechaCreacion?.startsWith(this.filtro.fecha)
          : true;

        // 🔥 **Filtrar por estado usando texto**
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

        // Asignamos los datos recibidos a la variable `trabajadores`
        this.trabajadores = response.data.map(trabajador => ({
          ...trabajador,
          fechaCreacion: trabajador.fechaCreacion ? trabajador.fechaCreacion.split("T")[0] : ""
        }));

        console.log("📊 Trabajadores procesados y asignados:", this.trabajadores);
      } catch (error) {
        console.error("❌ Error cargando trabajadores:", error);
      }
    },

    aplicarFiltros(filtro) {
      console.log("⚡ Aplicando filtros:", filtro);
      this.filtro = filtro;
    }
  },

  mounted() {
    this.fetchTrabajadores();
  }
};
</script>

<style scoped>
.tabla-estilizada {
  max-width: 1000px;
  margin: auto;
  border-radius: 8px;
  overflow: hidden;
}

</style>
