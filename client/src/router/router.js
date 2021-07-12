import { createRouter, createWebHistory } from "vue-router";
import Dashboard from '@/views/Dashboard.vue';
import Sites from "@/views/Sites.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/websites",
    name: "Sites",
    component: Sites,
  },
  {
    path: "/:catchAll(.*)",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
