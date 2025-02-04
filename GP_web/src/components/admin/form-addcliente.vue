<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6">Añadir Cliente</div>
    </q-card-section>

    <q-card-section>
      <q-input v-model="cliente.nombreCliente" label="Nombre o Razón Social" outlined dense />
      <q-input v-model="cliente.contactoCliente" label="Nombre del Representante" outlined dense />
      <q-input v-model="cliente.correoCliente" label="Correo Electrónico" outlined dense type="email" />
      <q-input v-model="cliente.telefonoCliente" label="Teléfono" outlined dense placeholder="#pais número telefónico" />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn color="primary" label="Registrar Cliente" @click="enviarCliente" />
      <q-btn color="negative" label="Cancelar" flat @click="limpiarFormulario" />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: "FormCliente",
  data() {
    return {
      cliente: {
        nombreCliente: "",
        contactoCliente: "",
        correoCliente: "",
        telefonoCliente: ""
      }
    };
  },
  methods: {
    enviarCliente() {
      // Emitir evento con los datos del cliente
      this.$emit("cliente-registrado", { ...this.cliente });

      // Limpiar el formulario después de enviar
      this.limpiarFormulario();
    },
    limpiarFormulario() {
      this.cliente = {
        nombreCliente: "",
        contactoCliente: "",
        correoCliente: "",
        telefonoCliente: ""
      };
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: auto;
}
/* Agrega margen arriba y abajo a todos los q-input */
:deep(.q-field) {
  margin: 20px 0;
}
</style>
