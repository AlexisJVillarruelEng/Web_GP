<template>
  <div class="role-container">
    <span class="role-label">Rol :</span>
    <q-badge color="grey-4" text-color="black" rounded>{{ userRole }}</q-badge>
  </div>
</template>

<script>
export default {
  name: "UserRole",
  data() {
    return {
      userRole: "Desconocido"
    };
  },
  mounted() {
    // Obtener el rol desde localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.rol) {
      this.userRole = userData.rol;
    }
  }
};
</script>

<style scoped>
.role-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
}

.role-label {
  color: black;
}

.q-badge {
  padding: 5px 10px;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid #ccc;
  background-color: #e0e0e0;
}
</style>
