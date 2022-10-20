import loginRoutes from './loginRoutes'

const indexRoutes = [
    {
        path: '/',
        redirect: '/login',
    },
    ...loginRoutes,
    {
        path: '/app',
        name: 'app',
        meta: {
            title: 'app',
        },
        component: () => import('@/views/App/Index.vue'),
    },
]

export default indexRoutes
