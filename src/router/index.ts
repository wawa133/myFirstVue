import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
//import WellComView from '../views/WellComView.vue'
import UserMessage from '../views/UserMessageView.vue'
import UnitAssets from '../views/UnitAssetsView.vue'
import StockStorage from '../views/StockStorageView.vue'
import AgriculturalMonitoring from '../views/AgriculturalMonitoringView.vue'
import ProjectFunds from '../views/ProjectFundsView.vue'
import RegionManagement from '../views/RegionManagementView.vue'
import UnitRegistration from '../views/UnitRegistrationView.vue'
import UserRegistration from '../views/UserRegistrationView.vue'
import GetBackPassWord from '../views/GetBackPassWordView.vue'
import Notification from '../views/NotificationPublic.vue'
import chileView from '../views/userPhone/chileView.vue'

//const BASE_URL = importMeta .meta.env.BASE_URL;
const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [
    //网站注册页面
    {
      path: '/Login',
      name: 'Login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: LoginView
    },
    //网站主页
    {
      path: '/WellCom',
      name: 'WellCom',
      component: () => import('@/views/WellComView.vue'),
      children: [
        {
          path: 'userInfo',
          name: 'userInfo',
          component: chileView
        }
      ]
    },
    //网站通迅录
    {
      path: '/UMessage',
      name: 'UMessage',
      component: UserMessage,
      children: [
        {
          path: 'chileView',
          name: 'chileView',
          component: chileView
        }
      ]
    },
    //两个名单
    {
      path: '/Notification',
      name: 'Notification',
      component: Notification
    },
    //生产经营主体名录
    {
      path: '/mainBodyList',
      name: 'mainBodyList',
      component: () => import('@/views/mainBodyList.vue')
    },
    //网站单位固定资产管理
    {
      path: '/UnitAssets',
      name: 'UnitAssets',
      component: UnitAssets,
      children: [
        {
          path: 'userInfo',
          name: 'userInfo',
          component: UnitAssets
        }
      ]
    },
    //网站单位物资出入库库存管理
    {
      path: '/stockStorage',
      name: 'stockStorage',
      component: StockStorage
    },
    //网站农业安全监测统计
    {
      path: '/AgriculturalMonitoring',
      name: 'AgriculturalMonitoring',
      component: AgriculturalMonitoring,
      children: [
        {
          path: 'userInfo',
          name: 'userInfo',
          component: AgriculturalMonitoring
        }
      ]
    },
    //网站项目资金使用管理
    {
      path: '/ProjectFunds',
      name: 'ProjectFunds',
      component: ProjectFunds,
      children: [
        {
          path: 'userInfo',
          name: 'userInfo',
          component: ProjectFunds
        }
      ]
    },
    //网站地理行政区域管理
    {
      path: '/RegionManagement',
      name: 'RegionManagement',
      component: RegionManagement,
      children: [
        {
          path: 'userInfo',
          name: 'userInfo',
          component: RegionManagement
        }
      ]
    },
    //网站单位注册管理
    {
      path: '/UnitRegistration',
      name: 'UnitRegistration',
      component: UnitRegistration,
      children: [
        {
          path: 'userInfo',
          name: 'userInfo',
          component: UnitRegistration
        }
      ]
    },
    //网站用户注册管理
    {
      path: '/UserRegistration',
      name: 'UserRegistration',
      component: UserRegistration,
      children: [
        {
          path: 'userInfo',
          name: 'userInfo',
          component: UserRegistration
        }
      ]
    },
    //网站用户密码找回
    {
      path: '/GetBackPassWord',
      name: 'GetBackPassWord',
      component: GetBackPassWord
    },
    //断网
    {
      path: '/network',
      name: 'network',
      component: () => import('@/components/networkDownLine.vue')
    },
    //刷新
    {
      path: '/refresh',
      name: 'refresh',
      component: () => import('@/components/refrishNetwork.vue')
    },
    //要目录重定向页
    {
      path: '/',
      redirect: '/WellCom'
    }
  ]
})

export default router
