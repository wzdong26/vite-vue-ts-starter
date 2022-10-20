import { createWebHistory, createRouter } from 'vue-router';
import indexRoutes from './indexRoutes';

const BASE_URL_PATH = import.meta.env.VITE_BASE_URL_PATH

const router = createRouter({
    history: createWebHistory(BASE_URL_PATH),
    routes: indexRoutes
});

export default router;