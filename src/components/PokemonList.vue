<template>
    <v-container>
        <v-row>
            <v-col cols="12">
               <v-text-field v-model="searchQuery" label="Search Pokemons" />
            </v-col>
            <v-col cols="12">
                <v-btn @click="toggleSortOrder">Sort: {{ sortOrder === 'asc'?'昇順' : '降順' }}</v-btn>
            </v-col>
            <v-col cols="12" v-if="loading" class="loading_area">
                <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                ></v-progress-circular>
            </v-col>
            <v-col v-if="!loading" v-for="pokemon in filteredPokemons" :key="pokemon.name" cols="12" md="4">
                <v-card>
                    <v-card-title>{{ pokemon.name }}</v-card-title>
                    <v-card-text>
                        <v-img
                             v-if="pokemonDetails(pokemon.name)"
                             :src="pokemonDetails(pokemon.name).sprites.front_default"
                            :alt="pokemon.name"
                            height="200"  
                        ></v-img>
                        <v-progress-circular
                            v-else
                            interminate
                            color="primary"
                            ></v-progress-circular>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const searchQuery = computed({
    get: () => store.state.searchQuery,
    set: (value) => store.commit('SET_SEARCH_QUERY', value)
})

const sortOrder = computed(() => store.state.sortOrder)
const filteredPokemons = computed(() => store.getters.filteredPokemons )
const loading = computed(() => store.getters.loading)
const pokemonDetails = (name) => store.getters.pokemonDetails(name)

const fetchPokemons = () => store.dispatch('fetchPokemons')
const fetchPokemonDetails = (name) => store.dispatch('fetchPokemonDetails', name)

const toggleSortOrder = () => {
   const newOrder = sortOrder.value === 'asc' ?'desc' : 'asc'
   store.commit('SET_SORT_ORDER', newOrder)
}

const loadPokemonDetails = (name) => {
    if(!pokemonDetails(name)) {
        fetchPokemonDetails(name)
    }
}

watch(filteredPokemons, (newpokemons) => { //何をしている記述？
    newpokemons.forEach(pokemon => loadPokemonDetails(pokemon.name))
})

onMounted(() => {
    fetchPokemons()
})
</script>

<style scoped>
.loading_area {
    display: flex;
    justify-content: center;
}

.v-btn {
    margin-bottom: 20px;
}
</style>
