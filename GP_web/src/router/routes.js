
const routes = [
   {
     path: '/dashboard',
     component: () => import('layouts/MainLayout.vue'),
     children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ],
    meta: { requiresAuth: true }
   },

  // //Rutas Administrador
{
    path: "/admin",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/admin/DashboardAdmin.vue") },
      { path: "add-worker", component: () => import("pages/admin/Crear-trabajadores.vue") },
      { path: "update-worker", component: () => import("pages/admin/Actualizar-EliminarTrabajador.vue") },
      { path: "worker-history", component: () => import("pages/admin/Historial-trabajadores.vue") },
      { path: "client-history", component: () => import("src/pages/admin/HistorialClientes.vue") },
      { path: "add-client", component: () => import("src/pages/admin/Anadir-Cliente.vue") },
      { path: "update-client", component: () => import("pages/admin/Actualizar-EliminarCliente.vue") },
      { path: "create-project", component: () => import("pages/admin/CrearProyecto.vue") },
      { path: "project-history", component: () => import("pages/admin/HistorialProyectos.vue") },
      { path: "edit-project", component: () => import("pages/admin/EditarProyecto.vue") },
      { path: "finish-project", component: () => import("pages/admin/FinalizarProyecto.vue") },
      {path: "archive-history", component: () => import("pages/admin/archivosGenerados.vue")},
      // archivos pdf excel
    ],
    meta: { requiresAuth: true, role: "Administrador" }, // 🔒 Protegido por rol
  },


  {
    path: '/',
    component: () => import('components/auth/LoginForm.vue'),
  },


  {
    path: '/empresa',
    component: () => import('components/auth/LoginFormEmpresa.vue'),
  },
  //rutas empresas
  {
    path: "/dashboard-empresas",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/empresas/empresasdashboard.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
