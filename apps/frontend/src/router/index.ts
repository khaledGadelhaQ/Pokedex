import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './../views/HomePage.vue'
import PokemonDetail from './../components/PokemonDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: HomePage,
        detail: PokemonDetail,
      },
    },
    {
      path: '/pokemons/:id',
      name: 'pokemon-detail',
      components: {
        default: HomePage,
        detail: PokemonDetail,
      },
      // allow the detail view to receive the route params as props if needed
      props: {
        detail: true,
      },
    },
  ],
})

export default router

