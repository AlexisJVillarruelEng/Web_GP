<template>
  <q-list bordered class="project-actions">
    <q-item-label header>Gestión de Proyectos</q-item-label>
    <q-item clickable v-ripple @click="$router.push('/admin/create-project')">
      <q-item-section>🛠 Crear Proyecto</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="$router.push('/admin/project-history')">
      <q-item-section>📜 Historial de Proyectos</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="$router.push('/admin/finish-project')">
      <q-item-section>✅ Finalizar Proyecto</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="$router.push('/admin/edit-project')">
      <q-item-section>✏️ Editar Proyecto</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: "ProjectActions",
};
</script>

<style scoped>
.project-actions {
  width: 250px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
}
</style>
