<template>
  <q-list bordered class="worker-actions">
    <q-item-label header>Gestión de Trabajadores</q-item-label>
    <q-item clickable v-ripple @click="$router.push('/admin/add-worker')">
      <q-item-section>➕ Añadir Trabajador</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="$router.push('/admin/update-worker')">
      <q-item-section>🔄 Actualizar Trabajador</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="$router.push('/admin/worker-history')">
      <q-item-section>📜 Historial de Trabajadores</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: "WorkerActions",
};
</script>

<style scoped>
.worker-actions {
  width: 250px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
}
</style>
