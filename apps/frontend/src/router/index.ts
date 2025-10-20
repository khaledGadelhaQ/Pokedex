import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './../views/HomePage.vue'
import PokemonDetail from './../components/PokemonDetail.vue'
import NotFoundPage from './../views/NotFoundPage.vue'

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
      path: '/pokemons/favorites',
      name: 'favorites',
      components: {
        default: HomePage,
        detail: PokemonDetail,
      },
      meta: {
        showFavoritesOnly: true,
      },
    },
    {
      path: '/pokemons/team',
      name: 'team',
      components: {
        default: HomePage,
        detail: PokemonDetail,
      },
      meta: {
        showTeamOnly: true,
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
    {
      // Catch-all 404 route
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
      meta: {
        fullPage: true,
      },
    },
  ],
})

export default router

