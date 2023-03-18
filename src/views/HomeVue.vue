<template>
    <div class="container mx-auto px-4 flex flex-col">
        <header class="flex justify-between my-5">
            <div>
                <Icon width="32" icon="fluent-mdl2:dictionary"/>
            </div>
            <div class="flex">
                <Icon width="32" icon="ph:sun"/>
                <!-- <Icon width="32" icon="ph:moon"/> -->
            </div>
        </header>
        <main style="flex: 1">
            <div class="search">
                <div :class="{'bg-indigo-100' : stateSearch}" class="grid grid-cols-7 border-2 border-black py-1 px-2 rounded">
                    <input class="col-span-6 outline-none disabled:bg-inherit" v-model="inputSearch" @keyup.enter="search" :disabled="stateSearch" type="text" placeholder="Search for any word">
                    <button class="col-span-1 flex justify-center items-center " @click="search" >
                        <Transition>
                            <Icon v-if="!stateSearch" width="32" icon="material-symbols:search"/>
                            <Icon v-else width="32" icon="svg-spinners:eclipse"/>
                        </Transition>
                    </button>
                </div>
            </div>
            <article v-if="firstMeaning">
                <div class="flex justify-between items-center py-6">
                    <div>
                        <h2>{{ toCapitalize( firstMeaning.word ) }}</h2>
                        <p v-if="firstMeaning.phonetics.length">{{ firstMeaning.phonetics[0].text }}</p>
                    </div>
                    <button 
                    class="bg-indigo-300 rounded-full w-10 h-10 flex justify-center items-center"
                    :disabled="audio.disabled" v-if="thereIsAudio" @click="audioPlay">
                        <Transition>
                            <Icon v-if="!audio.disabled" width="32" icon="material-symbols:play-arrow-outline"/>
                            <Icon v-else width="32" icon="svg-spinners:eclipse"/>
                        </Transition>
                    </button>
                </div>
                <div >
                    <div 
                    
                    v-for="(meaning, index) in firstMeaning.meanings" :key="index"
                        class="py-5 first:pt-0 ">
                        <div class="flex justify-between items-center gap-1">
                            <h3 class="font-bold">{{ toCapitalize( meaning.partOfSpeech ) }}</h3>
                            <hr class="border-1 border-black inline-block w-11/12">
                        </div>
                        <div class="my-2">
                            <h4>Meaning</h4>
                            <ul>
                                <li class="list-disc list-inside marker:text-indigo-300 py-1" v-for="definition in meaning.definitions" :key="definition.definition">
                                    {{ definition.definition }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="py-5">
                    <a :href="firstMeaning.sourceUrls[0]" target="_blank"><h4 >Source</h4></a>
                    <p class="flex items-center gap-1">
                        {{ firstMeaning.sourceUrls[0] }} 
                        <a :href="firstMeaning.sourceUrls[0]" target="_blank"><Icon width="32" icon="tabler:external-link"/></a>
                    </p>
                </div>
                <hr>
            </article>
        </main>
        
        <footer>
            <p class="text-center py-4">
                Implementation by D4ndres © 2023
            </p>
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
                data: null,
                audio: {
                    data: null,
                    disabled: null
                }
            }
        },
        methods: {
            async search(){
                if ( !this.inputSearch ) return 
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
            },
            async audioPlay(){
                const phonetic = this.thereIsAudio
                this.audio.data = new Audio(phonetic.audio)
                
                this.audio.disabled = true
                await this.audio.data.play()
                
                this.audio.data.addEventListener('ended', () => { this.audio.disabled = null })
            },
            toCapitalize(text){
                return text.substring(0,1).toUpperCase() + text.substring(1, text.length)
            }

        },
        computed: {
            firstMeaning(){
                if( this.data )
                    return this.data.length? this.data[0] : null
                else 
                    return null
            },
            thereIsAudio(){
                return this.firstMeaning.phonetics.find( item => item.audio )
            }
        }
    }
</script>
<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    position: absolute;
    opacity: 0;
}

</style>

