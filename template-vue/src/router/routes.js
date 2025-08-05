// 路由
export default [
    {path: '/', name: 'Layout', component: () => import('@/layout/index.vue'), children: [
        {path: '/', name: 'Index', component: () => import('@/view/index.vue'), meta: {title: '主页',},},
        {path: '/help', name: 'Help', component: () => import('@/view/help/index.vue'), meta: {title: '帮助',},},
        {path: '/about', name: 'About', component: () => import('@/view/about/index.vue'), meta: {title: '关于',},},
    ],},
    {path: '/:path(.*)*', name: 'NotFound', component: () => import('@/view/404.vue'),},
]
