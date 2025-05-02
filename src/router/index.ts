import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProblemDetail from "@/views/ProblemDetail.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import ProblemList from "@/views/ProblemList.vue";
import UserInfo from "@/views/UserInfo.vue";
import SubmissionList from "@/views/SubmissionList.vue";
import SubmissionDetail from "@/views/SubmissionDetail.vue";
import EditProblem from "@/views/EditProblem.vue";
import CreateProblem from "@/views/CreateProblem.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/problems/:id',
      name: 'ProblemDetail',
      component: ProblemDetail,
      props: true,        // 将 route.params.id 作为组件 prop
    },
    {
      path: '/problems',
      name: 'ProblemList',
      component: ProblemList,
    },
    {
      path: '/login',
      name: "LoginPage",
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/user',
      name: 'User',
      component: UserInfo
    },
    {
      path: '/submissions',
      name: 'SubmissionList',
      component: SubmissionList
    },
    {
      path: '/submissions/:id',
      name: 'SubmissionDetail',
      component: SubmissionDetail
    },
    {
      path: '/problems/new',
      component: CreateProblem
    },
    {
      path: '/problems/:id/edit',
      component: EditProblem,
      props: true
    },
  ],
})

export default router
