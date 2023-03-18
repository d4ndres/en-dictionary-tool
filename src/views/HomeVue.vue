<template>
    <div>
        <header>
            <div>
                <Icon width="32" icon="fluent-mdl2:dictionary"/>
            </div>
            <div>
                <Icon width="32" icon="ph:sun"/>
                <Icon width="32" icon="ph:moon"/>
            </div>
        </header>
        <main>
            <div class="search">
                <div class="input-wrapper">
                    <input v-model="inputSearch" @keyup.enter="search" :disabled="stateSearch" type="text" placeholder="Search for any word">
                    <button @click="search">
                        <Icon width="32" icon="material-symbols:search"/>
                    </button>
                </div>
            </div>
            <article class="result" v-if="firstMeaning">
                <div>
                    <div>
                        <h2>{{ firstMeaning.word }}</h2>
                        <p>{{ firstMeaning.phonetics[0].text }}</p>
                    </div>
                    <div>
                        <audio controls :src="firstMeaning.phonetics[0].audio" play="true"></audio>
                        <Icon width="32" icon="material-symbols:play-arrow-outline"/>
                    </div>
                </div>
                <div class="meanings">
                    <div 
                    v-for="(meaning, index) in firstMeaning.meanings" :key="index"
                        class="meaning">
                        <div>
                            <h3>{{ meaning.partOfSpeech }}</h3>
                            <hr>
                        </div>
                        <div>
                            <h4>Meaning</h4>
                            <ul>
                                <li v-for="definition in meaning.definitions" :key="definition.definition">
                                    {{ definition.definition }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="source">
                    <a href="" target="_blank"><h4>Source</h4></a>
                    <p>
                        {{ firstMeaning.sourceUrls[0] }} 
                        <a href="" target="_blank"><Icon width="32" icon="tabler:external-link"/></a>
                    </p>
                </div>
            </article>
        </main>
        <footer>
            me
        </footer>
    </div>
</template>

<script>
    import { Icon } from '@iconify/vue'

    export default {
        components: {
            Icon,
        },
        data(){
            return {
                inputSearch: null,
                stateSearch: null,
                data: null
            }
        },
        methods: {
            async search(){
                this.stateSearch = true
                try{
                    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.inputSearch}`)
                    this.data = await response.json()
                    if( !this.data.length ) throw 'Error: WordNotFound'
                    this.stateSearch = null
                } catch( error ){
                    console.error(error);
                    this.stateSearch = false
                }
            }
        },
        computed: {
            firstMeaning(){
                if( this.data )
                    return this.data.length? this.data[0] : null
                else 
                    return null
            }
        }
    }
</script>

