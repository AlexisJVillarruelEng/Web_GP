<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-center q-mb-md">Actualizar Trabajador</div>

    <!-- Campo de búsqueda -->
    <q-input v-model="search" label="Buscar por nombre, apellido, DNI, correo o estado" outlined dense class="q-mb-md campo-busqueda">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Tabla de Trabajadores -->
    <div class="tabla-container">
    <q-table
      :rows="trabajadoresFiltrados"
      :columns="columnas"
      row-key="idTrabajador"
      dense
      class="q-mb-md tabla-estilizada"
      @row-click="seleccionarTrabajador"
    />
    </div>
    <!-- Formulario de Edición -->
    <q-card class="q-pa-md form-container">
      <q-card-section>
        <div class="text-h6">Editar Trabajador</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="trabajadorSeleccionado.nombre" label="Nombre" outlined dense />
        <q-input v-model="trabajadorSeleccionado.apellido" label="Apellido" outlined dense />
        <q-input v-model="trabajadorSeleccionado.dni" label="DNI" outlined dense maxlength="8" />
        <q-input v-model="trabajadorSeleccionado.correo" label="Correo" outlined dense type="email" />

        <!-- Contraseña con icono para mostrar/ocultar -->
        <q-input
          v-model="trabajadorSeleccionado.contraseña"
          label="Contraseña"
          :type="mostrarContrasena ? 'text' : 'password'"
          outlined
          dense
          placeholder="No disponible"
        >
          <template v-slot:append>
            <q-icon
              :name="mostrarContrasena ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="mostrarContrasena = !mostrarContrasena"
            />
          </template>
        </q-input>

        <!-- Rol -->
        <q-select v-model="trabajadorSeleccionado.idRol" :options="roles" label="Rol" outlined dense />

        <!-- Ubigeo (Departamento, Provincia, Distrito) -->
        <q-select
          v-model="trabajadorSeleccionado.idUbigeo"
          :options="ubigeo"
          option-label="label"
          option-value="value"
          label="Ubigeo"
          outlined
          dense
        />

        <!-- Estado Activo/Inactivo -->
        <q-toggle v-model="trabajadorSeleccionado.estado" label="Estado (Activo/Inactivo)" class="q-mt-md" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar Cambios" @click="actualizarTrabajador" />
        <q-btn color="warning" label="Dar de Baja" @click="confirmDarDeBaja" />
        <q-btn color="negative" label="Eliminar" @click="confirmEliminarTrabajador" />
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
  name: "ActualizarTrabajadores",
  data() {
    return {
      trabajadores: [],
      trabajadorSeleccionado: {
        nombre: "",
        apellido: "",
        dni: "",
        correo: "",
        contraseña: "",
        idRol: null,
        idUbigeo: null,
        estado: true
      },
      search: "",
      roles: [],
      ubigeo: [],
      confirmDialog: false,
      confirmMessage: "",
      confirmButtonText: "",
      confirmButtonColor: "primary",
      confirmAction: () => {},
      mostrarContrasena: false
    };
  },
  computed: {
    trabajadoresFiltrados() {
      return this.trabajadores.filter((t) => {
        const query = this.search.toLowerCase();
        return (
          t.nombre.toLowerCase().includes(query) ||
          t.apellido.toLowerCase().includes(query) ||
          t.dni.toLowerCase().includes(query) ||
          t.correo.toLowerCase().includes(query) ||
          (t.estado ? "activo" : "inactivo").includes(query)
        );
      });
    },
  },
  methods: {
    async fetchTrabajadores() {
      try {
        const response = await this.$api.get("/Trabajadores?incluirInactivos=true");
        this.trabajadores = response.data;
      } catch (error) {
        console.error("Error cargando trabajadores:", error);
      }
    },
    async fetchRoles() {
      try {
        const response = await this.$api.get("/Roles");
        this.roles = response.data.map((rol) => ({ label: rol.nombreRol, value: rol.idRol }));
      } catch (error) {
        console.error("Error cargando roles:", error);
      }
    },
    async fetchUbigeo() {
      try {
        const response = await this.$api.get("/Ubigeo");
        this.ubigeo = response.data.map((u) => ({
          label: `${u.departamento}, ${u.provincia}, ${u.distrito}`,
          value: u.idUbigeo
        }));
      } catch (error) {
        console.error("Error cargando ubigeo:", error);
      }
    },
    seleccionarTrabajador(_, row) {
      this.$api.get(`/Trabajadores/${row.idTrabajador}`)
        .then(response => {
          this.trabajadorSeleccionado = response.data;
          this.$q.notify({ type: "info", message: "Trabajador seleccionado." });
        })
        .catch(error => {
          console.error("Error obteniendo los datos completos del trabajador:", error);
        });
    },
    async actualizarTrabajador() {
  try {
    // Validamos que se haya seleccionado un trabajador antes de hacer la actualización
    if (!this.trabajadorSeleccionado || !this.trabajadorSeleccionado.idTrabajador) {
      this.$q.notify({ type: "negative", message: "Debe seleccionar un trabajador antes de actualizar." });
      return;
    }

    // Construimos solo los datos necesarios para el PUT
    const data = {
      nombre: this.trabajadorSeleccionado.nombre,
      apellido: this.trabajadorSeleccionado.apellido,
      dni: this.trabajadorSeleccionado.dni,
      correo: this.trabajadorSeleccionado.correo,
      contraseña: this.trabajadorSeleccionado.contraseña, // Confirmamos que la API permite este campo
      idUbigeo: typeof this.trabajadorSeleccionado.idUbigeo === "object"
        ? this.trabajadorSeleccionado.idUbigeo.value
        : this.trabajadorSeleccionado.idUbigeo, // Convertimos idUbigeo a número si es un objeto
      idRol: typeof this.trabajadorSeleccionado.idRol === "object"
        ? this.trabajadorSeleccionado.idRol.value
        : this.trabajadorSeleccionado.idRol, // Convertimos idRol a número si es un objeto
      estado: this.trabajadorSeleccionado.estado
    };

    console.log("Enviando datos al API:", data); // Log para depuración
    console.log("Trabajador seleccionado:", this.trabajadorSeleccionado); // Log para depuración

    await this.$api.put(`/Trabajadores/${this.trabajadorSeleccionado.idTrabajador}`, data);

    this.$q.notify({
      type: "positive",
      message: "Trabajador actualizado con éxito."
    });

    // Refrescamos la tabla después de actualizar
    this.fetchTrabajadores();
  } catch (error) {
    console.error("Error actualizando trabajador:", error);
    this.$q.notify({
      type: "negative",
      message: "Error al actualizar el trabajador."
    });
  }
},

    confirmEliminarTrabajador() {
      this.confirmMessage = "¿Seguro que deseas eliminar este trabajador?";
      this.confirmButtonText = "Eliminar";
      this.confirmButtonColor = "negative";
      this.confirmAction = this.eliminarTrabajador;
      this.confirmDialog = true;
    },
    async eliminarTrabajador() {
      try {
        await this.$api.delete(`/Trabajadores/${this.trabajadorSeleccionado.idTrabajador}`);
        this.$q.notify({ type: "negative", message: "Trabajador eliminado." });
        this.confirmDialog = false;
        this.fetchTrabajadores();
      } catch (error) {
        console.error("Error eliminando trabajador:", error);
      }
    },
    confirmDarDeBaja() {
      this.confirmMessage = "¿Seguro que deseas dar de baja a este trabajador?";
      this.confirmButtonText = "Dar de Baja";
      this.confirmButtonColor = "warning";
      this.confirmAction = this.darDeBaja;
      this.confirmDialog = true;
    },
    async darDeBaja() {
      try {
        await this.$api.delete(`/Trabajadores/logical/${this.trabajadorSeleccionado.idTrabajador}`);
        this.$q.notify({ type: "warning", message: "Trabajador dado de baja." });
        this.confirmDialog = false;
        this.fetchTrabajadores();
      } catch (error) {
        console.error("Error al dar de baja:", error);
      }
    }
  },
  mounted() {
    this.fetchTrabajadores();
    this.fetchRoles();
    this.fetchUbigeo();
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
