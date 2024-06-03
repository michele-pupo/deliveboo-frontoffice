<!-- PAGINA DEPRECATA CHECKOUT SPOSTATO IN APPCART -->


<script>
import axios from 'axios';
import dropin from 'braintree-web-drop-in';


export default {
  data() {
    
    return {
      
      token: '',
      baseApiUrl: "http://127.0.0.1:8000/api/",
    };
  },

  methods: {
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
          container: '#dropin-container'
        }, (createErr, instance) => {
          if (createErr) {
            console.error('Errore durante la creazione dell\'interfaccia Drop-in:', createErr);
            return;
          }
          button.addEventListener('click', () => {
            instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
              if (requestPaymentMethodErr) {
                console.error('Errore durante la richiesta del metodo di pagamento:', requestPaymentMethodErr);
                return;
              }
              axios.post(this.baseApiUrl + "payment/checkout", { paymentMethodNonce: payload.nonce })
                .then(result => {              
                  if (result.data.success) {
                    document.getElementById('checkout-message').innerHTML = '<h1>Successo</h1><p>La tua interfaccia Drop-in funziona! Controlla il tuo <a href="https://sandbox.braintreegateway.com/login">sandbox Control Panel</a> per le tue transazioni di prova.</p>';
                  } else {
                    document.getElementById('checkout-message').innerHTML = '<h1>Errore</h1><p>Controlla la console per maggiori dettagli.</p>';
                  }
                })
                .catch(error => {
                  console.error('Errore durante il checkout:', error);
                  document.getElementById('checkout-message').innerHTML = '<h1>Errore</h1><p>Controlla la console per maggiori dettagli.</p>';
                });
            });
          });
        });
      } else {
        console.error('Pulsante submit non trovato!');
      }
    },
  },

  mounted() {
    this.getClientToken();
  }
};
</script>
<template>
  


  <div  class="my-box container py-5">
    <div id="dropin-wrapper">
      <div id="checkout-message"></div>
      <div id="dropin-container"></div>
      <button id="submit_button">Submit payment</button>
    </div>
  </div>


</template>

<style lang="scss">
.my-box {
  position: relative;
  z-index: 10;
}
</style>