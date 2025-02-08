<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-center q-mb-md">Historial de Clientes</div>

    <!-- ✅ Componente de filtro -->
    <AdminFiltroCliente @filtrar="aplicarFiltros" />

    <!-- 📋 Componente de Tabla de Clientes -->
    <AdminTablaClientes :clientes="clientesFiltrados" />
  </q-page>
</template>

<script>
import AdminFiltroCliente from "components/admin-filtro-cliente.vue";
import AdminTablaClientes from "components/admin-tabla-clientes.vue";

export default {
  name: "HistorialClientes",
  components: { AdminFiltroCliente, AdminTablaClientes },
  data() {
    return {
      clientes: [], // Lista de clientes desde la API
      filtro: {
        query: "",
        fecha: ""
      }
    };
  },
  computed: {
    clientesFiltrados() {
      return this.clientes.filter(cliente => {
        const query = this.filtro.query.toLowerCase();

        // 🔥 **Filtrar por nombre, representante, correo, teléfono**
        const cumpleBusqueda = query
          ? cliente.nombreCliente.toLowerCase().includes(query) ||
            cliente.contactoCliente.toLowerCase().includes(query) ||
            cliente.correoCliente.toLowerCase().includes(query) ||
            cliente.telefonoCliente.toLowerCase().includes(query)
          : true;

        // 🔥 **Filtrar por fecha**
        const cumpleFecha = this.filtro.fecha
          ? cliente.fechaCreacion?.startsWith(this.filtro.fecha)
          : true;

        return cumpleBusqueda && cumpleFecha;
      });
    }
  },
  methods: {
    async fetchClientes() {
      try {
        const response = await this.$api.get("/gpromecAPIv1/Clientes");
        console.log("Clientes obtenidos:", response.data);

        this.clientes = response.data.map(cliente => ({
          ...cliente,
          fechaCreacion: cliente.fechaCreacion ? cliente.fechaCreacion.split("T")[0] : ""
        }));
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    },
    aplicarFiltros(filtro) {
      this.filtro = filtro;
    }
  },
  mounted() {
    this.fetchClientes();
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
