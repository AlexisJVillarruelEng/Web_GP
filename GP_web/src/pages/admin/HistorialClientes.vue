<template>
  <q-page class="q-pa-md">
    <div class="container">
      <div class="title text-h5 text-center q-mb-md">Historial de Clientes</div>

      <!-- Contenedor del filtro alineado con la tabla -->
      <div class="filtro-container q-mb-md">
        <AdminFiltroCliente @filtrar="aplicarFiltros" />
      </div>

      <!-- Componente de Tabla de Clientes -->
      <AdminTablaClientes :clientes="clientesFiltrados" />
    </div>
  </q-page>
</template>

<script>
import AdminFiltroCliente from "components/admin/admin-filtro-clientes.vue";
import AdminTablaClientes from "components/admin/admin-tabla-clientes.vue";

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
        const cumpleBusqueda = query
          ? cliente.nombreCliente.toLowerCase().includes(query) ||
            cliente.contactoCliente.toLowerCase().includes(query) ||
            cliente.correoCliente.toLowerCase().includes(query) ||
            cliente.telefonoCliente.toLowerCase().includes(query)
          : true;
        return cumpleBusqueda;
      });
    }
  },
  methods: {
    async fetchClientes() {
      try {
        const response = await this.$api.get("/Clientes");
        console.log("Clientes obtenidos:", response.data);
        this.clientes = response.data;
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
.container {
  max-width: 1000px;
  margin: auto;
}

.filtro-container {
  /* Se asegura que el filtro tenga el mismo ancho que la tabla */
  max-width: 100%;
  margin: auto;
}

.tabla-estilizada {
  max-width: 1000px;
  margin: auto;
  border-radius: 8px;
  overflow: hidden;
}
</style>
