<template>
  <div class="login-container">
    <q-card class="login-card" style="max-width: 400px; margin: auto;">
      <q-card-section>
        <div class="text-h6">Iniciar Sesión - Gpromec</div>
      </q-card-section>
      <q-card-section>
        <!-- Selector de Empresa (Clientes) -->
        <q-select
          v-model="selectedEmpresa"
          :options="empresas"
          option-value="idCliente"
          option-label="nombreCliente"
          label="Empresa"
          outlined
          dense
          emit-value
          map-options
        />
        <!-- Correo -->
        <q-input
          v-model="correo"
          label="Correo"
          outlined
          dense
          class="q-mt-md"
        />
        <!-- Teléfono -->
        <q-input
          v-model="telefono"
          label="Teléfono"
          outlined
          dense
          class="q-mt-md"
        />
      </q-card-section>
      <q-card-actions align="right">
        <!-- Botón que redirige a la pantalla principal (opcional) -->
        <q-btn label="Login Gpromec" color="primary" @click="goHome" />
        <!-- Botón que realiza el POST al endpoint de login -->
        <q-btn label="Login" color="secondary" @click="iniciarSesion" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "LoginFormEmpresa",
  data() {
    return {
      empresas: [], // Lista de clientes para el selector
      selectedEmpresa: null,
      correo: "",
      telefono: ""
    };
  },
  methods: {
    async cargarEmpresas() {
      try {
        // Se asume que existe un endpoint para listar clientes
        const resp = await this.$api.get("/Clientes");
        this.empresas = resp.data;
      } catch (error) {
        console.error("Error al cargar empresas:", error);
      }
    },
    async iniciarSesion() {
      if (!this.selectedEmpresa || !this.correo || !this.telefono) {
        this.$q.notify({ type: "negative", message: "Complete todos los campos." });
        return;
      }
      try {
        const loginData = {
          nombreCliente: this.getEmpresaName(this.selectedEmpresa),
          correoCliente: this.correo,
          telefonoCliente: this.telefono
        };
        const resp = await this.$api.post("/Clientes/login", loginData);
        // Guarda la respuesta en localStorage usando la clave "userData"
        localStorage.setItem("userData", JSON.stringify(resp.data));
        this.$q.notify({ type: "positive", message: "Bienvenido " });
        // Redirige al dashboard de empresa
        this.$router.push("/dashboard-empresas");
      } catch (error) {
        console.error("Error en el login:", error);
        this.$q.notify({ type: "negative", message: "Credenciales inválidas." });
      }
    },
    getEmpresaName(idCliente) {
      const emp = this.empresas.find(e => e.idCliente === idCliente);
      return emp ? emp.nombreCliente : "";
    },
    goHome() {
      // Redirige a la página principal (opcional)
      this.$router.push("/");
    }
  },
  mounted() {
    this.cargarEmpresas();
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
