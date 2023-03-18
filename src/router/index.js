import { createRouter, createWebHistory } from 'vue-router';
import HomeVue from '../views/HomeVue.vue';

const routes = [
    {
        path: '/',
        name: 'HomeVue',
        component: HomeVue
    }
];

const router =  createRouter({
    history: createWebHistory( process.env.BASE_URL),
    routes
})

export default router;