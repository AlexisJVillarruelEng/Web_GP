<template>
  <div class="tabla-container">
    <q-table
      :rows="clientes"
      :columns="columnas"
      row-key="idCliente"
      dense
      class="q-mb-md tabla-estilizada"
    />
  </div>
</template>

<script>
export default {
  name: "AdminTablaClientes",
  props: {
    clientes: Array // Recibe los clientes filtrados como prop
  },
  data() {
    return {
      columnas: [
        { name: "nombreCliente", label: "Nombre", field: "nombreCliente", align: "left" },
        { name: "contactoCliente", label: "Representante", field: "contactoCliente", align: "left" },
        { name: "correoCliente", label: "Correo", field: "correoCliente", align: "left" },
        { name: "telefonoCliente", label: "Teléfono", field: "telefonoCliente", align: "left" },
        // { name: "fechaCreacion", label: "Fecha Creación", field: "fechaCreacion", align: "left", format: val => val ? new Date(val).toLocaleDateString() : "" }
      ]
    };
  }
};
</script>

<style scoped>
.tabla-container {
  max-width: 1000px;
  margin: auto;
  padding: 10px;
}

.tabla-estilizada {
  border-radius: 8px;
  overflow: hidden;
}
</style>
