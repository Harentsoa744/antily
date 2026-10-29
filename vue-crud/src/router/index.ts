import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import MemberList from '../pages/MemberList.vue';
import MemberForm from '../pages/MemberForm.vue';
import MembershipForm from '../pages/MembershipForm.vue';
import MembershipList from '../pages/MembershipList.vue';
import TerritoryForm from '../pages/TerritoryForm.vue';
import TerritoryList from '../pages/TerritoryList.vue';
import MembershipYearList from '../pages/MembershipYearList.vue';
import MembershipYearForm from '../pages/MembershipYearForm.vue';
import BranchList from '../pages/BranchList.vue';
import BranchForm from '../pages/BranchForm.vue';
import MembershipFeeList from '../pages/MembershipFeeList.vue';
import MembershipFeeForm from '../pages/MembershipFeeForm.vue';
import TerritoryLevelList from '../pages/TerritoryLevelList.vue';
import TerritoryLevelForm from '../pages/TerritoryLevelForm.vue';
import RoleList from '../pages/RoleList.vue';
import RoleForm from '../pages/RoleForm.vue';
import MembershipPaymentList from '../pages/MembershipPaymentList.vue';
import MembershipPaymentForm from '../pages/MembershipPaymentForm.vue';

import AleaList from '../pages/AleaList.vue';


const routes: RouteRecordRaw[] = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },

  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/member' },
      { path: '/alea', component: AleaList },
      { path: '/member', component: MemberList },
      { path: '/member/new', component: MemberForm },
      { path: '/member/:id/edit', component: MemberForm },
      { path: '/membership', component: MembershipList },
      { path: '/membership/new', component: MembershipForm },
      { path: '/membership/:id/edit', component: MembershipForm },
      { path: '/territory', component: TerritoryList },
      { path: '/territory/new', component: TerritoryForm },
      { path: '/territory/:id/edit', component: TerritoryForm },
      { path: '/membership-year', component: MembershipYearList },
      { path: '/membership-year/new', component: MembershipYearForm },
      { path: '/membership-year/:id/edit', component: MembershipYearForm },
      { path: '/branch', component: BranchList },
      { path: '/branch/new', component: BranchForm },
      { path: '/branch/:id/edit', component: BranchForm },
      { path: '/membership-fee', component: MembershipFeeList },
      { path: '/membership-fee/new', component: MembershipFeeForm },
      { path: '/membership-fee/:id/edit', component: MembershipFeeForm },
      { path: '/territory-level', component: TerritoryLevelList },
      { path: '/territory-level/new', component: TerritoryLevelForm },
      { path: '/territory-level/:id/edit', component: TerritoryLevelForm },
      { path: '/role', component: RoleList },
      { path: '/role/new', component: RoleForm },
      { path: '/role/:id/edit', component: RoleForm },
      { path: '/membership-payment', component: MembershipPaymentList },
      { path: '/membership-payment/new', component: MembershipPaymentForm },
      { path: '/membership-payment/:id/edit', component: MembershipPaymentForm },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.path === '/logout') {
    localStorage.removeItem('accessToken');
    return '/login';
  }
  const authenticated = Boolean(localStorage.getItem('accessToken'));
  if (to.meta.requiresAuth && !authenticated) {
    return '/login';
  }
  if ((to.path === '/login' || to.path === '/register') && authenticated) {
    return '/member';
  }
  return true;
});