<template>
  <q-page class="dashboard-container">
    <!-- Barra lateral con opciones -->
    <div class="userrole">
      <UserRole />
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
import UserRole from "components/admin/user-role.vue";
import ProjectActions from "components/admin/admin-ClientActions.vue";
import WorkerActions from "components/admin/admin-workerActions.vue";
import ClientActions from "components/admin/admin-projectActions.vue";
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
  width: 300px;
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
