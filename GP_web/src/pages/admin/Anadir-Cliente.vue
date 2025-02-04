<template>
  <q-page class="q-pa-md" >
    <div class="text-h5 text-center q-mb-md">Gestión de Clientes</div>

    <!-- Formulario de Cliente -->
    <FormCliente @cliente-registrado="registrarCliente" />
  </q-page>
</template>

<script>
import FormCliente from "components/admin/form-addcliente.vue"; // Asegúrate de que el nombre del archivo es correcto

export default {
  components: {
    FormCliente
  },
  methods: {
    async registrarCliente(cliente) {
      try {
        console.log("Enviando cliente a la API...", cliente);
        const response = await this.$api.post("/Clientes", cliente);
        console.log("Cliente registrado:", response.data);

        this.$q.notify({
          type: "positive",
          message: "Cliente registrado con éxito!"
        });
      } catch (error) {
        console.error("Error registrando cliente:", error);
        this.$q.notify({
          type: "negative",
          message: "Error al registrar el cliente."
        });
      }
    }
  }
};
</script>
