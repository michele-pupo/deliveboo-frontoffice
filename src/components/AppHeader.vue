<script>
import { store } from './store'

export default {
    name: 'AppHeader',

    data(){
        return{
            store,
            apiImageUrl: 'http://127.0.0.1:8000/storage/',

        }
    },

    mounted(){
        if (JSON.parse(localStorage.getItem("cart")) != null) {
            this.store.Cart = JSON.parse(localStorage.getItem("cart"))
        }
    },

    methods: {
        cartSize(){
            let size = 0
            this.store.Cart.items.forEach(item => {
                size += 1 * item.quantity
            });
            return size
        }
    },
}

</script>


<template>

<nav class="navbar navbar-expand-md">
    <div class="container">
        <!-- Logo a sinistra -->
        <div class="navbar-brand d-flex align-items-center">
            <div class="logo_laravel">
                <img :src="'http://localhost:8000/storage/' + 'branding/deliveboo.svg'" style="width: 100px" alt="">
            </div>
        </div>

        <!-- Bottone del toggler -->
        <button class="navbar-toggler border-0 my-burger" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
            <i class="fa-solid fa-burger"></i>
        </button>

        <!-- Elementi di navigazione a destra -->
        <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul class="navbar-nav gap-3">

                <!-- Link di navigazione -->
                <li class="nav-item">
                    <router-link :to="{ name: 'home'}" class=" text-decoration-none small">Home</router-link>
                </li>
                <li class="nav-item">
                    <a class="text-decoration-none small" href="http://127.0.0.1:8000/dashboard">Partner</a>
                </li>

                <!-- Icona del carrello -->
                <li class="nav-item small">
                    <router-link v-if="store.Cart.items.length > 0" :to="{name:'cart'}" class="text-decoration-none">
                        <div class="my_badge d-flex align-items-center gap-2 rounded-2 py-1 px-2">
                            <i class="fa-solid fa-cart-shopping"></i>
                            <span>{{ cartSize() }}</span>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</nav>


</template>

<style lang="scss">
@use '../styles/_variables' as *;

nav{
    background-color: #f8ebde;

    color: #D62300 !important;
    font-size: 25px;

    font-family: "Open Sans", sans-serif;
    font-optical-sizing: auto;

    z-index: 99;  

    ul{
        li, a{
            color: #D62300 !important;

            font-weight: bold;

            transition: .2s linear;

            display: flex;
            align-items: center;
            justify-content: center;

            :hover{
                transition: .2s linear;
                transform: scale(1.1);
            }

            .dropdown-menu{
                // background-color: rgb(251, 211, 171);
                background-color: red;
                position: absolute !important; 
                top: 70% !important;
                left: 60% !important;
                border: 1px solid #713616;

    
                transform: none;
        
            }
        
            .d-down ,a.dropdown-item{
                background-color: rgb(251, 211, 171);
                font-weight: bold;
                
                transition: none !important;
                transform: none !important;
        
                &:hover {
                    transform: none !important;
                    background-color: rgb(251, 195, 138);
                }
                    
            }

            .my_badge{
                border: 2px solid $color-red;
                border-radius: 20px;

                i, span{
                    transform: none;
                }
            }
        }
    }

    .my-burger{
        color: #d62300;

        font-size: 30px;
    }

}
</style>
