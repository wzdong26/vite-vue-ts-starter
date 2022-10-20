const loginRoutes = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登 录',
        },
        component: () => import('@/views/Login/Index.vue'),
    },
]

export default loginRoutes
