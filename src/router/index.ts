
import ContactDetail from '@/components/ContactDetail.vue'
import ContactList from '@/components/ContactList.vue'
import ContactLayout from '@/layout/ContactLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: ContactLayout,
      children: [
        {
          path: "",
          name: "home",
          component: ContactList,
        },
        {
          path: '/detail/:id',
          name: 'ContactDetail',
          component: ContactDetail
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router