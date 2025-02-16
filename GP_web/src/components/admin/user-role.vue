<template>
  <div class="role-container">
    <span class="role-label">Rol :</span>
    <q-badge color="grey-4" text-color="black" rounded>{{ userRole }}</q-badge>
    <span class="user-name" v-if="userName">  {{ userName }}</span>
  </div>
</template>

<script>
export default {
  name: "UserRole",
  data() {
    return {
      userRole: "Desconocido",
      userName: "Desconocido"
    };
  },
  mounted() {
    // Obtener el objeto userData del localStorage y extraer rol y nombre
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData && userData.rol) {
          this.userRole = userData.rol;
        }
        if (userData && userData.nombre) {
          this.userName = userData.nombre;
          console.log("Nombre del usuario:", this.userName);
        }
      } catch (error) {
        console.error("Error al parsear userData:", error);
      }
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
