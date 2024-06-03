<script>
import axios from 'axios';
import dropin from 'braintree-web-drop-in';
import { router } from '../router';
import { store } from '../components/store';
import AppLoader from '../components/AppLoader.vue';


export default {
    name: "AppCart",

    components: {
        AppLoader

    },

    data() {
        return {
            isloader:false,
            store,
            token: '',
            baseApiUrl: "http://127.0.0.1:8000/api/",
            form: $('form'),
            formData: {
                amount: 0,
                email: '',
                billingAddress: {
                    name: '',
                    surname: '',
                    phoneNumber: '',
                    address: '',
                }
            },
            formErrors: {},
        }
    },

    mounted() {

        document.documentElement.scrollTop = 0

        console.log(JSON.parse(localStorage.getItem("cart")));

        // recupera carrello
        if (JSON.parse(localStorage.getItem("cart")) != null) {
            this.store.Cart = JSON.parse(localStorage.getItem("cart"))
        }

        // recupera token checkout
        this.getClientToken();
        // document.getElementById('checkout-message').innerHTML = 'Test';

    },



    methods: {
        // METODI CARRELLO
        AddItemToCart(plate) {
            if (this.store.Cart.items.length != 0 && this.store.Cart.items.find((Item) => Item.restaurant_id != plate.restaurant_id)) {
                console.log("Diverso");

            } else {
                const CurrentItem = this.store.Cart.items.find((Item) => Item.id === plate.id)

                if (CurrentItem) {
                    CurrentItem.quantity++;
                    CurrentItem.subTotal = CurrentItem.price * CurrentItem.quantity
                    plate.subTotal = plate.subTotal.toFixed(2)
                } else {
                    let Item = plate;
                    Item.quantity = 1;
                    Item.restaurant = this.singleRestaurant.name_res;
                    Item.restaurant_id = plate.restaurant_id; // Assicurati che questo campo esista nei dati del piatto
                    Item.subTotal = Item.price;
                    this.store.Cart.items.push(Item);
                }

                this.store.Cart.total = 0
                this.store.Cart.items.forEach(item => {
                    this.store.Cart.total += Number(item.subTotal)
                });
                this.store.Cart.total = this.store.Cart.total.toFixed(2)

                localStorage.setItem("cart", JSON.stringify(this.store.Cart));
                console.log(JSON.parse(localStorage.getItem("cart")));
            }
        },

        RemoveItemFromCart(plate) {
            const plateIndex = this.store.Cart.items.findIndex((Item) => Item.id === plate.id)

            if (plateIndex != -1) {
                const plate = this.store.Cart.items[plateIndex]

                if (plate.quantity > 1) {
                    plate.quantity -= 1
                    plate.subTotal = plate.price * plate.quantity
                    plate.subTotal = plate.subTotal.toFixed(2)
                } else {
                    this.store.Cart.items.splice(plateIndex, 1)
                }
            }

            this.store.Cart.total = 0
            this.store.Cart.items.forEach(item => {
                this.store.Cart.total += Number(item.subTotal)
            });
            this.store.Cart.total = this.store.Cart.total.toFixed(2)

            localStorage.setItem("cart", JSON.stringify(this.store.Cart));
            console.log(JSON.parse(localStorage.getItem("cart")));
        },

        isItemInCart(plateId) {
            return this.store.Cart.items.some(item => item.id === plateId);
        },

        emptyCart() {
            this.store.Cart = {
                items: [],
                total: 0
            };
            localStorage.removeItem("cart");
        },

        // METODI CHECKOUT
        async getClientToken() {
            try {
                const res = await axios.get(this.baseApiUrl + "payment/token");
                console.log(res);

                

                this.token = res.data.token;
                this.initializeBraintree();

                
            } catch (error) {
                console.error("Errore durante il recupero del token:", error);
            }
        },

        initializeBraintree() {
            const button = document.querySelector('#submit_button');
            if (button) {
                dropin.create({
                    authorization: this.token,
                    container: '#dropin-container',
                    threeDSecure: true,
                }, (createErr, instance) => {
                    if (createErr) {
                        console.error('Errore durante la creazione dell\'interfaccia Drop-in:', createErr);
                        return;
                    }
                    button.addEventListener('click', (e) => {

                        e.preventDefault();

                        setTimeout(() => {
                            this.isloader=true;
                        }, 1500);

                        // Imposta l'importo della transazione
                        this.formData.amount = this.store.Cart.total;

                        instance.requestPaymentMethod({
                            threeDSecure: {
                                amount: this.formData.amount,
                                email: this.formData.email,
                                billingAddress: this.formData.billingAddress
                            }
                        }, (requestPaymentMethodErr, payload) => {
                            if (requestPaymentMethodErr) {
                                console.error('Errore durante la richiesta del metodo di pagamento:', requestPaymentMethodErr);
                                this.isloader=false;
                                //da cambiare
                                return;
                            }
                            axios.post(this.baseApiUrl + "payment/checkout", {
                                

                                paymentMethodNonce: payload.nonce,
                                amount: this.store.Cart.total, // Passa l'importo totale qui
                                formData: this.formData

                            })
                                .then(result => {
                                    if (result.data.success) {
                                        this.createOrder();
                                        this.emptyCart();
                                        setTimeout(() => {
                                            this.isloader=true;
                                        }, 1500);
                                        setTimeout(() => {
                                            this.isloader = false;
                                            document.getElementById('checkout-message').innerHTML = `
                                            <div style="text-align: center;">
                                                <h1>Your Order was successful!</h1>
                                                <p style="color: black">You should receive a mail shortly with the details</p>
                                                <img src="/public/file.png" alt="Order Successful" style="max-width: 50%; height: auto;">
                                            </div>
                                            `;
                                        }, 1500);
                                        // document.getElementById('checkout-message').innerHTML = '<h1>Your Order was successful</h1><p>You should receive a mail shortly with the details</p>';
                                        // router.push({ name: 'checkout' });
                                        console.log('info', result)
                                        
                                        
                                    } else {
                                        this.isloader = false;


                                        document.getElementById('checkout-message').innerHTML = '<h1>Error</h1>';
                                        console.log('apiErrors', result);
                                        this.formErrors = result.data.error
                                        console.log('jsErrors', this.formErrors)
                                    }

                                })
                                .catch(error => {
                                    this.isloader = false;


                                    console.error('Errore durante il checkout:', error);
                                    document.getElementById('checkout-message').innerHTML = '<h1>Error</h1><p>Try again or with a different card</p>';
                                });
                        });
                    });
                });
            } else {
                console.error('Pulsante submit non trovato!');
            }
        },

        createOrder() {
            axios.post(this.baseApiUrl + "order", {
                cart: this.store.Cart,
                customerData: this.formData
            })
                .then(result => {
                    console.log(result);
                })
                .catch(error => {
                    console.error("Errore creando l'ordine", error);
                });
        },

        // funzione per svuotare il carrello dopo il pagamento
        emptyCart() {
            this.store.Cart = {
                items: [],
                total: 0
            };
            localStorage.removeItem("cart");
        },
    },

    watch: {
        // Il watcher rende solamente l'oggetto cart reattivo in componenti diversi
        'Cart.items'(newItems, oldItems) { },
    },

    computed: {
        formIsValid() {
            if (this.formData.email == '' || this.formData.billingAddress.name == '' || this.formData.billingAddress.surname == '' || this.formData.billingAddress.address == '' || this.formData.billingAddress.phoneNumber == '') {
                return true
            } else {
                return false
            }
        },

        formHasError(input) {
            if (this.formErrors.hasOwnProperty(input)) {
                return 'border border-danger'
            }
        }

    }
}
</script>



<template>
    <AppLoader v-if="isloader"></AppLoader>
    <div  v-else class="my-box container py-4 px-4 col-12">
        <!-- Pulsante Back -->
        <div v-if="store.Cart.items.length > 0">
            <router-link :to="{ name: 'restaurant', params: { id: store.Cart.items[0].restaurant_id } }" class="my-arrow fa-solid fa-reply text-decoration-none"></router-link>
        </div>


        <!-- CARRELLO -->

        <div class=" rounded-5 col-12 col-lg-8 col-sm-10 m-auto shadow-lg p-2" id="Carrello">
            <div v-if="store.Cart.items.length > 0">
                <h2 class="text-center pt-3"><i class="fa-solid fa-shopping-cart"></i></h2>
                <h3 class="text-center fs-1 fw-bolder">{{ store.Cart.items[0].restaurant }}</h3>

                <div class=" justify-content-between align-items-center pb-3">
                    <div v-for="item in store.Cart.items" :key="item.id" class="p-3 text-start text-black">
                        <div class="d-flex justify-content-around align-items-center pb-3 text-black fw-bolder">
                            <div>{{ item.quantity }}x {{ item.name }}</div>
                            <div>{{ item.subTotal }} &euro;</div>
                        </div>
                        <div
                            class="d-flex justify-content-center align-items-center border-bottom border-black pb-3 gap-3">
                            <button class="btn btn-outline-danger" @click="RemoveItemFromCart(item)"><i
                                    class="fa-solid fa-minus"></i></button>
                            <button class="btn btn-outline-success" @click="AddItemToCart(item)"><i
                                    class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <h4 class="p-3 text-end text-white text-center text-bg-primary fw-bolder rounded-5 m-3">Total: {{ store.Cart.total}} &euro;</h4>
                </div>
            </div>
            <p v-else class="fs-5 text-center">Your Cart is Empty</p>
        </div>

        <!-- CHECKOUT -->
        <form v-if="this.store.Cart.total > 0" class="my-5 col-12 col-lg-8 col-sm-10 p-2 m-auto shadow-lg container-md" action="javascript:void(0)">

            <div>
                <label class="form-label" for="name">Name*</label>
                <input class="form-control" type="name" name="name" v-model="formData.billingAddress.name" required>
                <div class="text-danger" v-if="formErrors.hasOwnProperty('formData.billingAddress.name')">Please
                    input your name</div>
            </div>

            <div>
                <label class="form-label" for="surname">Surname*</label>
                <input class="form-control" type="surname" name="surname" v-model="formData.billingAddress.surname"
                    required>
                <div class="text-danger" v-if="formErrors.hasOwnProperty('formData.billingAddress.surname')">Please
                    input your surname</div>
            </div>

            <div>
                <label class="form-label" for="email">Email*</label>
                <input class="form-control" type="email" name="email" v-model="formData.email" required>
                <div class="text-danger" v-if="formErrors.hasOwnProperty('formData.email')">Please input a valid
                    email</div>
            </div>

            <div>
                <label class="form-label" for="address">Address*</label>
                <input class="form-control" type="text" name="address" v-model="formData.billingAddress.address"
                    required>
                <div class="text-danger" v-if="formErrors.hasOwnProperty('formData.billingAddress.address')">Please
                    input your address</div>
            </div>

            <div>
                <label class="form-label" for="phone">Phone Number*</label>
                <input class="form-control" type="text" name="phone" v-model="formData.billingAddress.phoneNumber">
                <div class="text-danger" v-if="formErrors.hasOwnProperty('formData.billingAddress.phoneNumber')">
                    Please input your phone Number</div>
            </div>

            <small class="fw-bolder">*these fields are required</small>

            <div id="dropin-container" class=""></div>

            <div class=" d-flex justify-content-center">
                <button class="btn  btn-outline-success" id="submit_button" :disabled="formIsValid">Submit payment</button>
            </div>
        </form>
    </div>
    <div id="checkout-message" class="text-center"></div>

    

</template>



<style lang="scss" scoped>
@use '../styles/variables' as *;

.my-box {
    position: relative;
    z-index: 10;
    color: black;

    .my-arrow {
        font-size: 35px;
        color: #ff0800;
        position: relative;
        
        padding-bottom: 20px;

        left: 0;        
    }
    @media (max-width: 768px) {
            .my-arrow{
                right: 10%;
            font-size: 2.3em;
            }
        }
        @media (max-width: 425px) {
            .my-arrow{
                right: 15%;
            font-size: 2.3em;
            }
        }
        @media (min-width: 768.01px) and (max-width: 1024px) {
            .my-arrow{
                right: 10%;
            font-size: 2.3em;
            }
        }
}

#Carrello {
    background-color: #f8ebde;
    // width: 15%;
    border: solid 1px #3b3b3b52;
    border-radius: 0.2em;
    // height: 100vh;
    margin: 1em 0 1em 0;
    overflow-y: auto;
    position: relative;
    z-index: 10;
    // padding: 1rem;

    .lista {
        list-style: none;
    }

    h2 {
        font-family: "Open Sans", cursive;
        
        color: #d62300;
    }

    h3{
        font-family: "Open Sans", cursive;
        
        color: #d62300;
    }
}
form{
    border: solid 1px #3b3b3b52;
    border-radius:10px;
    padding: 1.5%;
    background-color: #F8EBDE;

    input{
        color: black;
        background-color: rgba(128, 128, 128, 0.226);
    }
}
</style>