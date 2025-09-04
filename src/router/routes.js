import { useAuthStore } from 'src/stores/auth-store';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/IndexPage.vue'), name: 'login' }
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/HomePage.vue'), name: 'home' }
    ]
  },
  {
    path: '/payment',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/PaymentPage.vue'), name: 'payment' }
    ]
  },
  {
    path: '/receipt',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/ReceiptPage.vue'), name: 'receipt' }
    ]
  },
  {
    path: '/remittance',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/RemittancePage.vue'), name: 'remittance' }
    ]
  },
  {
    path: '/analytic',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/AnalyticsPage.vue'), name: 'analytic' }
    ]
  },
  {
    path: '/preference',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/PreferencePage.vue'), name: 'preference' }
    ]
  },
  {
    path: '/report',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/ReportPage.vue'), name: 'report' }
    ]
  },
  {
    path: '/me',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/MePage.vue'), name: 'me' }
    ]
  },
  {
    path: '/log',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
    children: [
      { path: '', component: () => import('src/pages/LogPage.vue'), name: 'log' }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
