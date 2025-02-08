<template>
  <q-card class="q-pa-md form-container">
    <q-card-section>
      <div class="text-h6">Añadir Obras</div>
    </q-card-section>

    <q-card-section v-for="(obra, index) in obras" :key="index">
      <q-input v-model="obra.nombreObra" label="Nombre de la Obra" outlined dense />
      <q-input v-model="obra.ubicacion" label="Ubicación" outlined dense />
      <q-input v-model="obra.fechaInicio" label="Fecha de Inicio" outlined dense type="date" />
      <q-input v-model="obra.fechaFin" label="Fecha de Fin" outlined dense type="date" />
      <q-btn color="negative" label="Eliminar" flat @click="eliminarObra(index)" />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn color="primary" label="Guardar Obras" @click="enviarObras" />
      <q-btn color="secondary" label="Agregar Otra Obra" flat @click="agregarObra" />
    </q-card-actions>
  </q-card>
</template>



<script>
export default {
  name: "FormObra",
  props: {
    proyectoId: Number
  },
  data() {
    return {
      obras: [{ nombreObra: "", ubicacion: "", fechaInicio: "", fechaFin: "" }]
    };
  },
  methods: {
    agregarObra() {
      this.obras.push({ nombreObra: "", ubicacion: "", fechaInicio: "", fechaFin: "" });
    },
    eliminarObra(index) {
      this.obras.splice(index, 1);
    },
    async enviarObras() {
      try {
        console.log("📤 Enviando obras...");

        // Enviar obras una por una
        const promesas = this.obras.map(obra => {
          return this.$api.post("/Obras", {
            nombreObra: obra.nombreObra,
            ubicacion: obra.ubicacion,
            fechaInicio: obra.fechaInicio,
            fechaFin: obra.fechaFin,
            idProyecto: this.proyectoId
          });
        });

        await Promise.all(promesas);
        console.log("✅ Obras guardadas correctamente");

        this.$q.notify({ type: "positive", message: "Obras registradas con éxito!" });

        // 🔥 Emitimos el evento asegurándonos de que hay una espera antes de ejecutarlo
        setTimeout(() => {
          console.log("📢 Emitiendo evento obrasGuardadas...");
          this.$emit("obrasGuardadas");
        }, 500);

      } catch (error) {
        console.error("❌ Error guardando obras:", error);
        this.$q.notify({ type: "negative", message: "Error al guardar las obras." });
      }
    }
  }
};
</script>
