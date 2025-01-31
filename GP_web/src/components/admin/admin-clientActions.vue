<template>
  <q-list bordered class="client-actions">
    <q-item-label header>Gestión de Clientes</q-item-label>
    <q-item clickable v-ripple @click="$router.push('/admin/client-history')">
      <q-item-section>📋 Historial de Clientes</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="$router.push('/admin/add-client')">
      <q-item-section>➕ Añadir Cliente</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="$router.push('/admin/update-client')">
      <q-item-section>🔄 Actualizar Cliente</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: "ClientActions",
};
</script>

<style scoped>
.client-actions {
  width: 250px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
}
</style>
