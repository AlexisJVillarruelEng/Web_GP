<template>
  <q-list bordered class="archive-history">
    <q-item-label header>Historial de Archivos</q-item-label>
    <q-item clickable v-ripple @click="$router.push('/admin/archive-history')">
      <q-item-section>📂 Ver Archivos</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: "ArchiveHistory",
};
</script>

<style scoped>
.archive-history {
  width: 200px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
}
</style>
