<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6">Crear Proyecto</div>
    </q-card-section>

    <q-card-section>
      <!-- 🔹 Seleccionar Cliente -->
      <q-select
        v-model="proyecto.idCliente"
        :options="clientes"
        option-value="idCliente"
        option-label="nombreCliente"
        label="Seleccionar Cliente"
        outlined
        dense
        emit-value
        map-options
      />

      <!-- 🔹 Datos del Proyecto -->
      <q-input v-model="proyecto.nombreProyecto" label="Nombre del Proyecto" outlined dense />
      <q-input v-model="proyecto.descripcion" label="Descripción del Proyecto" outlined dense type="textarea" />
      <q-input v-model="proyecto.fechaInicio" label="Fecha de Inicio" outlined dense type="date" />
      <q-input v-model="proyecto.fechaFin" label="Fecha de Fin" outlined dense type="date" />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn color="primary" label="Guardar Proyecto" @click="enviarProyecto" />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: "FormProyecto",
  data() {
    return {
      clientes: [],
      proyecto: {
        nombreProyecto: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        idCliente: null
      }
    };
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

    async enviarProyecto() {
      console.log("📤 Enviando proyecto:", this.proyecto);

      try {
        // Asegurar que idCliente sea un número válido
        const proyectoData = {
          ...this.proyecto,
          idCliente: this.proyecto.idCliente?.idCliente ?? this.proyecto.idCliente
        };

        const response = await this.$api.post("/Proyectos", proyectoData);

        if (response.data && response.data.id) {
          console.log("✅ Proyecto creado con ID:", response.data.id);

          // Emitimos el evento asegurando que el ID es correcto
          this.$emit("guardarProyecto", response.data.id);
        } else {
          console.error("⚠️ La API no devolvió un ID válido.");
        }

        this.$q.notify({
          type: "positive",
          message: "Proyecto creado con éxito!"
        });

      } catch (error) {
        console.error("❌ Error en el POST:", error.response?.data || error);
        this.$q.notify({
          type: "negative",
          message: "Error al crear el proyecto."
        });
      }
    }
  },
  mounted() {
    this.fetchClientes();
  }
};
</script>
