<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="form-container">
      <q-card-section>
        <div class="text-h5 text-center">Añadir Trabajador</div>
      </q-card-section>

      <q-card-section>
        <!-- Nombre y Apellido -->
        <q-input v-model="worker.nombre" label="Nombre" outlined dense class="q-mt-md"/>
        <q-input v-model="worker.apellido" label="Apellido" outlined dense class="q-mt-md"/>

        <!-- DNI con validación -->
        <q-input
          v-model="worker.dni"
          label="DNI"
          outlined
          dense
          maxlength="8"
          type="text"
          :error="dniError"
          :error-message="dniErrorMessage"
          @blur="validarDNI"
        />

        <!-- Correo con validación -->
        <q-input
          v-model="worker.correo"
          label="Correo"
          type="email"
          outlined
          dense
          :error="correoError"
          :error-message="correoErrorMessage"
          @blur="validarCorreo"
        />

        <!-- Contraseña con icono 👁 -->
        <q-input
          v-model="worker.contraseña"
          label="Contraseña"
          :type="mostrarContrasena ? 'text' : 'password'"
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon
              :name="mostrarContrasena ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="mostrarContrasena = !mostrarContrasena"
            />
          </template>
        </q-input>

        <!-- Ubicación: Provincia, Departamento, Distrito -->
        <div class="q-mt-md">
          <div class="text-subtitle2 q-mb-sm">Ubicación</div>
          <div class="row q-gutter-md">
            <q-select
              v-model="worker.provincia"
              :options="provincias"
              label="Provincia"
              outlined
              dense
              @update:model-value="seleccionarProvincia"
            />
            <q-select
              v-model="worker.departamento"
              :options="departamentos"
              label="Departamento"
              outlined
              dense
              :disable="!worker.provincia"
              @update:model-value="seleccionarDepartamento"
            />
            <q-select
              v-model="worker.distrito"
              :options="distritos"
              label="Distrito"
              outlined
              dense
              :disable="!worker.departamento"
            />
          </div>
        </div>

        <!-- Fecha de Creación (Deshabilitada) -->
        <q-input v-model="worker.fecha" label="Fecha" type="date" outlined dense disable class="q-mt-md"/>

        <!-- Selección de Rol -->
        <q-select
          v-model="worker.rol"
          :options="roles"
          option-label="label"
          option-value="value"
          label="Rol"
          outlined
          dense
        />

        <!-- Botón de Registro -->
        <q-btn color="primary" label="Registrar Trabajador" class="full-width q-mt-md" @click="registrarTrabajador" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "CrearTrabajador",
  setup() {
    const worker = ref({
      nombre: "",
      apellido: "",
      dni: "",
      correo: "",
      contraseña: "",
      provincia: null,
      departamento: null,
      distrito: null,
      fecha: new Date().toISOString().slice(0, 10),
      rol: null,
    });

    const provincias = ref([]);
    const departamentos = ref([]);
    const distritos = ref([]);
    const roles = ref([]);
    const ubigeoData = ref([]);

    // Obtener Ubigeo
    const fetchUbigeo = async () => {
      try {
        const response = await axios.get("https://localhost:7165/gpromecAPIv1/Ubigeo");
        ubigeoData.value = response.data;
        provincias.value = [...new Set(response.data.map((u) => u.provincia))].map((prov) => ({ label: prov, value: prov }));
      } catch (error) {
        console.error("Error cargando ubigeo:", error);
      }
    };

    const seleccionarProvincia = () => {
      worker.value.departamento = null;
      worker.value.distrito = null;
      departamentos.value = [
        ...new Set(ubigeoData.value.filter(u => u.provincia === worker.value.provincia.value).map(u => u.departamento))
      ].map(dep => ({ label: dep, value: dep }));
    };

    const seleccionarDepartamento = () => {
      worker.value.distrito = null;
      distritos.value = [
        ...new Set(ubigeoData.value.filter(u => u.provincia === worker.value.provincia.value && u.departamento === worker.value.departamento.value).map(u => u.distrito))
      ].map(dist => ({ label: dist, value: dist }));
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get("https://localhost:7165/gpromecAPIv1/Roles");
        roles.value = response.data.map(rol => ({ label: rol.nombreRol, value: rol.idRol }));
      } catch (error) {
        console.error("Error cargando roles:", error);
      }
    };

    // Obtener ID Ubigeo
    const obtenerIdUbigeo = () => {
      const seleccion = ubigeoData.value.find(
        (u) =>
          u.provincia.toLowerCase() === worker.value.provincia?.value.toLowerCase() &&
          u.departamento.toLowerCase() === worker.value.departamento?.value.toLowerCase() &&
          u.distrito.toLowerCase() === worker.value.distrito?.value.toLowerCase()
      );
      return seleccion ? seleccion.idUbigeo : null;
    };

    const registrarTrabajador = async () => {
      try {
        const trabajadorData = {
          nombre: worker.value.nombre,
          apellido: worker.value.apellido,
          dni: worker.value.dni,
          correo: worker.value.correo,
          contraseña: worker.value.contraseña,
          idUbigeo: obtenerIdUbigeo(),
          idRol: worker.value.rol?.value,
        };

        console.log("Enviando datos:", trabajadorData);

        const response = await axios.post("https://localhost:7165/gpromecAPIv1/Trabajadores", trabajadorData);
        alert(`Trabajador registrado exitosamente. ID: ${response.data.id} Nombre: ${response.data.nombre}`);
      } catch (error) {
        console.error("Error registrando trabajador:", error);
      }
    };

    const dniError = ref(false);
    const dniErrorMessage = ref("");

    const validarDNI = () => {
      worker.value.dni = worker.value.dni.replace(/\D/g, "").slice(0, 8);
      dniError.value = worker.value.dni.length !== 8;
      dniErrorMessage.value = dniError.value ? "El DNI debe tener 8 dígitos." : "";
    };

    const correoError = ref(false);
    const correoErrorMessage = ref("");

    const validarCorreo = () => {
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      correoError.value = !regexCorreo.test(worker.value.correo);
      correoErrorMessage.value = correoError.value ? "Ingrese un correo válido." : "";
    };

    const mostrarContrasena = ref(false);

    onMounted(() => {
      fetchUbigeo();
      fetchRoles();
    });

    return {
      worker,
      provincias,
      departamentos,
      distritos,
      roles,
      seleccionarProvincia,
      seleccionarDepartamento,
      registrarTrabajador,
      validarDNI,
      validarCorreo,
      dniError,
      dniErrorMessage,
      correoError,
      correoErrorMessage,
      mostrarContrasena,
    };
  },
};
</script>

<style scoped>
/* Contenedor principal */
.form-container {
  max-width: 500px;
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Espaciado entre elementos */
.q-mt-md {
  margin-top: 10px;
}

/* Formato del título */
.text-h5 {
  font-weight: bold;
  color: #2c3e50;
}

/* Espaciado entre inputs */
.q-card-section q-input,
.q-card-section q-select {
  margin-bottom: 12px;
}

/* Asegurar que los selects de ubicación estén alineados */
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* Cada select de ubicación ocupa un tercio del ancho */
.q-select {
  flex: 1;
  min-width: 100px;
}

/* Mejorar visibilidad del select de rol */
.q-select[color="black"] {
  color: black;
}

/* Estilos para el botón de registrar */
.full-width {
  width: 100%;
}

/* Ícono de mostrar/ocultar contraseña */
.cursor-pointer {
  cursor: pointer;
}
</style>
