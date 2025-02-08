<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-center q-mb-md">Actualizar Cliente</div>

    <!-- Campo de búsqueda -->
    <q-input
      v-model="search"
      label="Buscar por nombre, representante, correo o teléfono"
      outlined
      dense
      class="q-mb-md campo-busqueda"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Tabla de Clientes -->
    <div class="tabla-container">
      <q-table
        :rows="clientesFiltrados"
        :columns="columnas"
        row-key="idCliente"
        dense
        class="q-mb-md tabla-estilizada"
        @row-click="seleccionarCliente"
      />
    </div>

    <!-- Formulario de Edición -->
    <q-card class="q-pa-md form-container">
      <q-card-section>
        <div class="text-h6">Editar Cliente</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="clienteSeleccionado.nombreCliente" label="Nombre o Razón Social" outlined dense />
        <q-input v-model="clienteSeleccionado.contactoCliente" label="Nombre del Representante" outlined dense />
        <q-input v-model="clienteSeleccionado.correoCliente" label="Correo Electrónico" outlined dense type="email" />
        <q-input v-model="clienteSeleccionado.telefonoCliente" label="Teléfono" outlined dense />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar Cambios" @click="actualizarCliente" />
        <q-btn color="negative" label="Eliminar Cliente" @click="confirmEliminarCliente" />
      </q-card-actions>
    </q-card>

    <!-- Modal de Confirmación -->
    <q-dialog v-model="confirmDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ confirmMessage }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat :label="confirmButtonText" :color="confirmButtonColor" @click="confirmAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: "ActualizarClientes",
  data() {
    return {
      clientes: [], // Lista de clientes obtenidos de la API
      clienteSeleccionado: {
        nombreCliente: "",
        contactoCliente: "",
        correoCliente: "",
        telefonoCliente: "",
      },
      search: "",
      confirmDialog: false,
      confirmMessage: "",
      confirmButtonText: "",
      confirmButtonColor: "primary",
      confirmAction: () => {},
    };
  },
  computed: {
    clientesFiltrados() {
      return this.clientes.filter((c) => {
        const query = this.search.toLowerCase();
        return (
          c.nombreCliente.toLowerCase().includes(query) ||
          c.contactoCliente.toLowerCase().includes(query) ||
          c.correoCliente.toLowerCase().includes(query) ||
          c.telefonoCliente.toLowerCase().includes(query)
        );
      });
    },
  },
  methods: {
    async fetchClientes() {
      try {
        const response = await this.$api.get("/Clientes");
        this.clientes = response.data;
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    },
    seleccionarCliente(_, row) {
      this.$api
        .get(`/Clientes/${row.idCliente}`)
        .then((response) => {
          this.clienteSeleccionado = response.data;
          this.$q.notify({ type: "info", message: "Cliente seleccionado." });
        })
        .catch((error) => {
          console.error("Error obteniendo los datos del cliente:", error);
        });
    },
    async actualizarCliente() {
      try {
        if (!this.clienteSeleccionado || !this.clienteSeleccionado.idCliente) {
          this.$q.notify({ type: "negative", message: "Debe seleccionar un cliente antes de actualizar." });
          return;
        }

        const data = {
          nombreCliente: this.clienteSeleccionado.nombreCliente,
          contactoCliente: this.clienteSeleccionado.contactoCliente,
          correoCliente: this.clienteSeleccionado.correoCliente,
          telefonoCliente: this.clienteSeleccionado.telefonoCliente,
        };

        await this.$api.put(`/Clientes/${this.clienteSeleccionado.idCliente}`, data);

        this.$q.notify({
          type: "positive",
          message: "Cliente actualizado con éxito.",
        });

        this.fetchClientes();
      } catch (error) {
        console.error("Error actualizando cliente:", error);
        this.$q.notify({
          type: "negative",
          message: "Error al actualizar el cliente.",
        });
      }
    },
    confirmEliminarCliente() {
      this.confirmMessage = "¿Seguro que deseas eliminar este cliente?";
      this.confirmButtonText = "Eliminar";
      this.confirmButtonColor = "negative";
      this.confirmAction = this.eliminarCliente;
      this.confirmDialog = true;
    },
    async eliminarCliente() {
      try {
        await this.$api.delete(`/Clientes/${this.clienteSeleccionado.idCliente}`);
        this.$q.notify({ type: "negative", message: "Cliente eliminado." });
        this.confirmDialog = false;
        this.fetchClientes();
      } catch (error) {
        console.error("Error eliminando cliente:", error);
      }
    },
  },
  mounted() {
    this.fetchClientes();
  },
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
.fila-resaltada {
  background-color: #d4edda;
  transition: background-color 2s;
}

.form-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

/* Contenedor para centrar la tabla */
.tabla-container {
  max-width: 1000px;
  margin: auto;
  padding: 10px;
}

/* Estilizar la tabla */
.tabla-estilizada {
  border-radius: 8px;
  overflow: hidden;
}

.campo-busqueda {
  margin: auto;
  width: 400px;
  margin-bottom: 20px;
}
</style>
