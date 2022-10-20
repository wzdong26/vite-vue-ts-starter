const loginRoutes = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登 录',
        },
        component: () => import('@/views/login/index.vue')
    },
];

export default loginRoutes;
