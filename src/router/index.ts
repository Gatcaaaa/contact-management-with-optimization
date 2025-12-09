
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
        // Nanti jika kamu mau buat halaman create/detail, tambahkan di sini:
        // { path: 'create', component: CreateContact },
        // { path: ':id', component: DetailContact },
      ]
    },
    // Opsional: Redirect sembarang URL balik ke home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router