//引入路由对象
import { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory, RouteRecordRaw } from 'vue-router'
import { createVNode, render, VNode } from 'vue'
// 引入 LoadingBar
import LoadingBar from '@/components/Loading/LoadingBar.vue'

//路由数组的类型 RouteRecordRaw
// 定义一些路由
// 每个路由都需要映射到一个组件。
const routes: Array<RouteRecordRaw> = [
    // 导航守卫测试页面
    {
        path: '/',
        name: 'login',
        alias: '/login',
        // 路由元信息
        meta: {
            title: '登录页面',
            transition: 'animate__fadeIn',
        },
        component: () => import('@/views/NavigationGuardTest/login.vue'),
    },
    // 导航守卫测试主页面(需要登录才能访问)(导航界面)
    {
        path: "/navigation",
        name: "navigation",
        meta: {
            title: '组件导航页面',
            transition: 'animate__fadeIn',
        },
        component: () => import("@/components/Navigation/Navigation.vue")
    },
    {
        path: '/helloworld',
        name: 'helloWorld',
        meta: {
            title: 'HelloWorld',
            transition: 'animate__fadeIn',
        },
        component: () => import('../components/HelloWorld.vue')
    },
    {
        path: '/marquee',
        name: 'marquee',
        meta: {
            title: '跑马灯',
            transition: 'animate__fadeIn',
        },
        component: () => import('../components/Marquee.vue')
    },
    {
        path: '/goodsWarehouse',
        name: 'goodsWarehouse',
        meta: {
            title: '商品仓库',
            transition: 'animate__fadeIn',
        },
        component: () => import('@/components/GoodsWarehouse/footer.vue'),
        children: [
            {
                // path 设为空默认显示该子路由页面
                path: '',
                name: 'goodsWarehouseMain',
                meta: {
                    title: '商品仓库主页面',
                    transition: 'animate__fadeIn',
                },
                component: () => import('@/components/GoodsWarehouse/GoodsWarehouse.vue')
            },
            {
                path: 'goodInfo/:id',
                name: 'goodInfo',
                meta: {
                    title: '商品详情页面',
                    transition: 'animate__fadeIn',
                },
                component: () => import('@/components/GoodsWarehouse/GoodInfo.vue')
            }
            // {
            //     path: '/goodInfo',
            //     name: 'goodInfo',
            //     component: () => import('@/components/GoodsWarehouse/GoodInfo.vue')
            // },
        ]
    },
    {
        path: '/namedVIew',
        name: 'namedView',
        // 别名
        alias: ['/namedView1', '/namedView2'],
        meta: {
            title: '命名视图',
            transition: 'animate__fadeIn',
        },
        // 字符串形式 redirect
        redirect: '/namedView/user1',
        // 对象形式 redirect
        // redirect:{path:'/namedView/user1'},
        // 函数形式 redirect
        // redirect: to => {
        //     // console.log("函数形式重定向")
        //     return {
        //         path: '/namedView/user1',
        //         query: {
        //             name: '233'
        //         }
        //     }
        // },
        component: () => import('@/components/NamedViewsTest/root.vue'),
        children: [{
            path: "user1",
            name: "user1",
            meta: {
                title: 'user1',
                transition: 'animate__fadeIn',
            },
            components: {
                default: () => import('@/components/NamedViewsTest/A.vue'),
            }
        },
        {
            path: "user2",
            name: "user2",
            meta: {
                title: 'user2',
                transition: 'animate__fadeIn',
            },
            components: {
                b: () => import('@/components/NamedViewsTest/B.vue'),
                c: () => import('@/components/NamedViewsTest/C.vue')
            }
        }
        ]
    },
    // 测试页面
    {
        path: '/test',
        name: 'test',
        meta: {
            title: '测试页面',
            transition: 'animate__fadeIn',
        },
        component: () => import('@/components/test.vue')
    },
]

// 创建 router
const router = createRouter({
    history: createWebHistory(),
    routes
})

// 定义路由白名单
const whiteList = ['/login', '/404', '/401', '/lock']

// 将 LoadingBar 转成 VNode
const LoadingBarVNode: VNode = createVNode(LoadingBar)
console.log("LoadingBarVNode如下:", LoadingBarVNode);
// 将 LoadingBarVNode 挂载到 body 上
// render(LoadingBarVNode, document.body)

// 定义 meta 中的属性类型, 以免后面使用时报类型错误
declare module 'vue-router' {
    interface RouteMeta {
        title: string
    }
}

//  使用导航守卫(前置守卫)
router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    // 挂载 LoadingBar 到 body 上(折中做法)
    render(LoadingBarVNode, document.body)
    LoadingBarVNode.component?.exposed?.startLoading()
    // 若路由在白名单内或者已经登录(有token), 则放通
    if (whiteList.indexOf(to.path) !== -1 || localStorage.getItem('token')) {
        next()
    } else {
        // 否则跳转到登录页面
        next('/login')
    }
})

// 使用后置钩子
router.afterEach((to, from) => {
    LoadingBarVNode.component?.exposed?.stopLoading()
})


//导出router
export default router