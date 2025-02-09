<template>
  <q-page class="dashboard-container">
    <!-- Barra lateral con opciones -->
    <div class="userrole">
      <UserRole />

      <!-- Botón de Cerrar Sesión -->
      <q-btn
        label="Cerrar Sesión"
        color="red"
        class="logout-button"
        @click="logout"
      />
    </div>

    <!-- Contenedor central con el logo -->
    <div class="main-content">
      <q-card class="company-logo">
        <q-img src="src/Resources/logo_empresa.jpeg" alt="Logo de la Empresa" contain />
      </q-card>
    </div>

    <!-- Sección de acciones -->
    <div class="actions-container">
      <ProjectActions />
      <WorkerActions />
      <ClientActions />
      <ArchiveHistory />
    </div>
  </q-page>
</template>

<script>
import { useRouter } from "vue-router";
import UserRole from "components/admin/user-role.vue";
import ProjectActions from "components/admin/admin-projectActions.vue";
import WorkerActions from "components/admin/admin-workerActions.vue";
import ClientActions from "components/admin/admin-clientActions.vue";
import ArchiveHistory from "components/admin/admin-archiveHistory.vue";


export default {
  name: "AdminDashboard",
  components: {
    UserRole,
    ProjectActions,
    WorkerActions,
    ClientActions,
    ArchiveHistory,
  },
  setup() {
    const router = useRouter(); // Importamos el router para redireccionar

    // 🔴 Método para cerrar sesión
    const logout = () => {
      localStorage.removeItem("userData"); // Eliminar datos del usuario
      router.push("/"); // Redirigir a Login
    };

    return { logout };
  },
};
</script>

<style scoped>
/* Diseño de la página del dashboard */
.dashboard-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background-color: #f4f4f4;
}

/* Estilos de la barra lateral */
.userrole {
  width: 20%;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centrar el botón */
}

/* Botón de cerrar sesión */
.logout-button {
  margin-top: 20px;
  width: 80%;
}

/* Contenedor del logo */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Imagen del logo */
.company-logo {
  width: 400px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Contenedor de las acciones (botones) */
.actions-container {
  width: 20%;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
