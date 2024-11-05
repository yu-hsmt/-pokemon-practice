import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    pokemons: [],
    loading: false,
    searchQuery: '',
    sortOrder: 'asc',
    pokemonDetails: {}
  },
  mutations: {
    SET_POKEMONS(state, pokemons) {
      state.pokemons = pokemons
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query
    },
    SET_SORT_ORDER(state, order) {
      state.sortOrder = order
    },
    SET_POKEMON_DETAILS(state, {name, details}) { //第二引数の{}はなに？引数3つではダメ？
      state.pokemonDetails = {...state.pokemonDetails, [name]: details} //state内の配列pokemonDetailsに、nameをキー・detailsを中身としてポケモンの情報をひとつずつ追加している　という認識であってる？
    }
  },
  actions: {
    async fetchPokemons ({commit}) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
        commit('SET_POKEMONS', response.data.results)
      } catch (error) {
        console.error(error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchPokemonDetails ({commit}, name) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        commit('SET_POKEMON_DETAILS', {name, details: response.data}) //responseのdataを「details」という変数に格納してコミットの引数にしている　という認識であってる？
      } catch (error) {
        console.error(error)
      }
    }
  },
  getters: {
    filteredPokemons: (state) => {
      let filtered = state.pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase())) //filter()内の「pokemon =>」ってなに？なんのために必要？
      if (state.sortOrder === 'asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
      } else {
        filtered.sort((a, b) => b.name.localeCompare(a.name))
      }
      return filtered
    },
    loading: (state) => state.loading,
    pokemonDetails: (state) => (name) => state.pokemonDetails[name]

  }

})