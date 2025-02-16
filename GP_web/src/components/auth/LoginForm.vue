<template>
  <div class="login-container">
    <q-card class="login-card">
      <q-form @submit.prevent="Login" class="q-gutter-md">
        <q-input
          outlined
          v-model="user.correo"
          type="email"
          label="Correo*"
          hint="Ingrese su correo"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Por favor ingrese su correo']"
        />

        <q-input
          outlined
          v-model="user.contraseña"
          :type="isPassword ? 'password' : 'text'"
          label="Contraseña*"
          hint="Ingrese Contraseña"
          lazy-rules
          :rules="[ val => val !== null && val !== '' || 'Ingresar Contraseña']"
        >
          <template v-slot:append>
            <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="togglePassword" />
          </template>
        </q-input>

        <div class="button-container">
          <q-btn label="Login" type="submit" color="primary" />
          <!--<q-btn label="Empresa" color="primary"></q-btn>-->
          <q-btn label="Login Empresa" color="secondary" @click="goToEmpresaLogin" />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "LoginForm",
  setup() {
    const $q = useQuasar(); // ✅ Asegura que $q.notify funcione
    const router = useRouter();
    const user = ref({
      correo: "",
      contraseña: ""
    });

    const isPassword = ref(true);

    const togglePassword = () => {
      isPassword.value = !isPassword.value;
    };

    const Login = async () => {
      try {
        console.log("Datos enviados:", user.value);

        let response = await fetch("https://localhost:7165/gpromecAPIv1/Trabajadores/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user.value)
        });

        if (!response.ok) {
          throw new Error("Credenciales incorrectas");
        }

        let data = await response.json();
        console.log("Respuesta API:", data);

        // ✅ Guardar el rol en localStorage
        localStorage.setItem("userData", JSON.stringify(data));

        // ✅ Notificación
        $q.notify({
          message: "Inicio de Sesion exitoso.",
          color: "positive",
          position: "bottom",
          timeout: 5000
        });

        // ✅ Redirección según el rol
        if (data.rol === "Administrador") {
          router.push("/admin");
        } else if (data.rol === "Trabajador") {
          router.push("/dashboard/trabajador");
        } else {
          router.push("/");
        }
      } catch (error) {
        $q.notify({
          message: "Error en login. Verifica tus credenciales.",
          color: "negative",
          position: "bottom",
          timeout: 5000
        });
        console.error("Error en login:", error);
      }
    };
    const goToEmpresaLogin = () => {
      // Redirige a la pantalla de login específica para empresa
      router.push("/empresa");
    };

    // ✅ Revisar si ya hay una sesión activa en `localStorage`
    onMounted(() => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.rol) {
        if (userData.rol === "Administrador") {
          router.push("/admin");
        } else if (userData.rol === "Trabajador") {
          router.push("/dashboard/trabajador");
        }
      }
    });

    return { user, isPassword, togglePassword, Login, goToEmpresaLogin };
  }
};
</script>

<style scoped>
/* Estilos para centrar el formulario */
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

.button-container {
  display: flex;
  justify-content: center;
}
</style>
