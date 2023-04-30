import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 独享路由守卫
/**
 * 判断用户身份 
 *        如果身份是教师   则无法访问管理员页面
 *        如果身份是管理员 则无法访问教师页面
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path:'/admin',
    component: Layout,
    name:'Admin',
    meta:{title:'管理员',icon:'el-icon-user'},
    children:[
      {
        path:'teacher',
        name:'Teacher',
        component:()=>import('@/views/admin/teacher'),
        meta:{title:'教师管理',isAuth:true},
        beforeEnter: (to, from, next) => {
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "管理员"){
            next();
          }else{
            alert("你没有权限访问");
          }
        }
      },
      {
        path:'student',
        name:'Student',
        component:()=>import('@/views/admin/student'),
        meta:{title:'学生管理',isAuth:true},
        beforeEnter: (to, from, next) => {
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "管理员"){
            next();
          }else{
            alert("你没有权限访问");
          }
        }
      },
      {
        path:'attendance',
        name:'Attendance',
        component:()=>import('@/views/admin/attendance'), 
        meta:{title:'考勤管理',isAuth:true},
        beforeEnter: (to, from, next) => {
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "管理员"){
            next();
          }else{
            alert("你没有权限访问");
          }
        }
      },
      {
        path:'alarm',
        name:'Alarm',
        component:()=>import('@/views/admin/alarm'),
        meta:{title:'报警信息管理',isAuth:true},
        beforeEnter: (to, from, next) => {
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "管理员"){
            next();
          }else{
            alert("你没有权限访问");
          }
        }
      },
      {
        path:'academic',
        name:'Academic',
        component:()=>import('@/views/admin/academic'),
        meta:{title:'学情分析管理',isAuth:true},
        beforeEnter: (to, from, next) => {
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "管理员"){
            next();
          }else{
            alert("你没有权限访问");
          }
        }
      },
    ]
  },
  {
    path:'/teacher',
    component: Layout,
    name:'Teacher',
    meta:{title:'教师',icon:'el-icon-user'},
    children:[
      {
        path:'class',
        name:'Class',
        component:()=>import('@/views/teacher/Class'),
        meta:{title:'班级管理'},
        beforeEnter: (to, from, next) => {
        
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "教师"){
            next();
          }else{
            alert("你没有权限访问");
           
          }
        }
      },
      {
        path:'student',
        name:'Student',
        component:()=>import('@/views/teacher/Student'),
        meta:{title:'学生管理'},
        beforeEnter: (to, from, next) => {
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "教师"){
            next();
          }else{
            alert("你没有权限访问");
          }
        }
      },
      {
        path:'attendance',
        name:'Attendance',
        component:()=>import('@/views/teacher/Attendance'),
        meta:{title:'考勤管理'},
        beforeEnter: (to, from, next) => {
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "教师"){
            next();
          }else{
            alert("你没有权限访问");
          }
        }
      },
      {
        path:'posture',
        name:'Posture',
        component:()=>import('@/views/teacher/Posture'),
        meta:{title:'坐姿信息'},
        beforeEnter: (to, from, next) => {
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "教师"){
            next();
          }else{
            alert("你没有权限访问");
          }
        }
      },
      {
        path:'academic',
        name:'Academic',
        component:()=>import('@/views/teacher/academic'),
        meta:{title:'学情分析'},
        beforeEnter: (to, from, next) => {
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "教师"){
            next();
          }else{
            alert("你没有权限访问");
          }
        }
      },
      {
        path:'statistics',
        name:'Statistics',
        component:()=>import('@/views/teacher/Statistics'),
        meta:{title:'数据统计'},
        beforeEnter: (to, from, next) => {
          if(JSON.parse(window.sessionStorage.getItem("admin")).identity == "教师"){
            next();
          }else{
            alert("你没有权限访问");
          }
        }
      },
    ],
  },
  
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service supp ort
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
