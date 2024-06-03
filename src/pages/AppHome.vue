<script>
import axios from "axios";
import AppRestaurant from '../components/AppRestaurant.vue';
import AppLoader from '../components/AppLoader.vue';

//dichiarazione dello store
import { store } from "../components/store";

export default {
  name: "AppHome",

  components: {
    AppRestaurant,
    AppLoader,
  },

  data() {
    return {
      baseApiUrl: "http://127.0.0.1:8000/api/",
      categories: [],
      Risultato: [],
      ArrayCategory: [],
      imageReady: false,
      store,
    }
  },

  methods: {
    async apiCall() {
      try {
        const res = await axios.get(this.baseApiUrl + "categories");
        this.categories = res.data.results;
        console.log(this.categories);

        // Aspetta il caricamento di tutte le immagini
        await this.loadAllImages();
        this.isLoading = false;
        this.imageReady = true
      } catch (error) {
        console.error("Errore nel caricamento delle categorie:", error);
      }
    },

    async CallCategory() {
      try {
        const res = await axios.post(this.baseApiUrl + "categories", {
          queryId: this.ArrayCategory,
        });
        this.Risultato = res.data.results;
        console.log(this.Risultato);
      } catch (error) {
        console.error("Errore nel caricamento dei risultati della categoria:", error);
      }
    },

    AddCategory(valoreDaInserire) {
      const index = this.ArrayCategory.indexOf(valoreDaInserire);

      if (index === -1) {
        this.ArrayCategory.push(valoreDaInserire);
      } else {
        this.ArrayCategory.splice(index, 1);
      }

      this.CallCategory();
      console.log(this.ArrayCategory);

      sessionStorage.setItem('categoryPermanent', JSON.stringify(this.ArrayCategory))
      console.log('Categorie cliccate', JSON.parse(localStorage.getItem("categoryPermanent")));
    },

    loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    },

    async loadAllImages() {
      const imagePromises = this.categories.map(category => {
        const imageUrl = `http://localhost:8000/storage/${category.image}`;
        return this.loadImage(imageUrl);
      });

      await Promise.all(imagePromises);
    },

    scrollToTarget() {
      const targetSection = document.getElementById('target');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
  },

  mounted() {
    this.apiCall();

    if (JSON.parse(sessionStorage.getItem("categoryPermanent")) != null) {
      this.ArrayCategory = JSON.parse(sessionStorage.getItem("categoryPermanent"))
      this.CallCategory();
    }
  },
}
</script>


<template>

  <!-- jumbo -->
  <div>
    <div class="jumbotron d-flex align-items-start p-lg-5 align-items-lg-center h-50">
      <div class="container-fluid d-flex justify-content-center justify-content-lg-between flex-wrap ">
        <div class="welcome_text d-flex align-items-center justify-content-center col-12 col-lg-5 ">
          <h1>
            WELCOME <span class="d-none d-sm-inline">TO<br> DELIVEBOO!</span>
          </h1>
        </div>
        <!-- <div class="center-box col-2 d-flex align-items-end justify-content-center rounded-3 ">
          <button @click="scrollToTarget()" class="my-btn"><i class="fa-solid fa-down-long"></i></button>
        </div> -->
        <div class="logo_laravel col-5 d-none d-lg-flex justify-content-end align-items-center ">
          <img class="slide object-fit-cover" :src="'http://localhost:8000/storage/' + 'branding/meat.png'" alt="@">
        </div>
      </div>

    </div>

  </div>
  <!-- End Jumbo -->


  <section id="target">
    <div class="container">
      <div class="container p-0 py-5">
        <h2 class="do-you">WHAT DO YOU WANT EAT?</h2>
        <div class="row row-cols-2 row-cols-md-4 row-cols-lg-6 row-gap-4 justify-content-center flex-wrap">
          <div @click="AddCategory(category.id)" v-for="category in categories" :key="category.id"
            :class="{ 'selected': ArrayCategory.includes(category.id) }"
            class="d-flex col full-card align-items-center justify-content-center">
            <div class="card-category card w-100 h-100 rounded-4">
              <Transition name="fade" mode="out-in">
                <img v-if="imageReady" class="category-img d-none d-md-flex rounded-4 rounded-bottom-0"
                  :src="'http://localhost:8000/storage/' + category.image" alt="">
                <img v-else class="category-img d-none d-md-flex rounded-4 rounded-bottom-0"
                  src="/src/assets/fallback.svg" alt="fallback">
              </Transition>
              <div class="p-3 card-text">{{ category.name }}</div>
            </div>
          </div>
        </div>
        <!-- passiamo i ristoranti e le categorie al componente AppRestaurant -->
        <AppRestaurant :restaurants="Risultato" :categories="categories"></AppRestaurant>
      </div>
    </div>
  </section>
</template>


<style lang="scss">
@use '../styles/variables' as *;

// jumbo
.jumbotron {
  padding: 50px;
  overflow-x: hidden;
  // height: calc(100vh - 80px);
  position: relative;

  .welcome_text {
    h1 {
      font-size: 70px;
      color: #D62300;
      font-family: $mibery-font;
      font-style: normal;
      z-index: 99;
    }
  }

  .my-btn {
    padding: 10px 18px;
    border-radius: 50%;
    font-size: 25px;
    color: #D62300;

    border: #D62300 1px solid;
    background-color: #f8ebde;
    z-index: 99;

    i {
      display: block;
      font-size: 1.5em;
    }

    &:hover {
      background-color: #f8ebde;
      color: #D62300;
      border-color: #D62300;
      animation: pulse .8s infinite;
      animation-timing-function: linear;

    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.1);
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      }

      ;

      100% {
        transform: scale(1);
      }
    }
  }

  .logo_laravel {
    .slide {
      height: 100%;
      transform: rotate(20deg);
      -webkit-animation: slide 0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275) 0.7s both;
      animation: slide 0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275) 0.7s both;

      @-webkit-keyframes slide {
        0% {
          -webkit-transform: translateX(100vw);
          transform: translateX(100vw);
        }

        100% {
          -webkit-transform: translateX(-100px);
          transform: translateX(-100px);
        }
      }

      @keyframes slide {
        0% {
          -webkit-transform: translateX(100vw);
          transform: translateX(100vw);
        }

        100% {
          -webkit-transform: translateX(-180px);
          transform: translateX(-180px);
        }
      }
    }
  }

}

// End jumbo

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;

}

section {

  .do-you {
    font-size: 60px;
    color: $color-green;
    font-family: $mibery-font;
    text-align: center;
    margin-bottom: 20px;

    z-index: 99;
    position: relative;
  }

  strong {
    color: $color-green;
    font-family: 'Open Sans', sans-serif;
    font-weight: bold;
    font-style: normal;
    margin-bottom: 20px;
    font-size: 30px;

    text-align: center;
    display: block;
  }

  .full-card {

    .card-category {
      background-color: #f8ebde;
      text-align: center;
      cursor: pointer;
      user-select: none;
      transition: transform, color, .3s ease;
      // box-shadow: -10px -10px 25px 0 #fff9f3, 10px 10px 25px 0 #a29992;
      box-shadow: -10px -10px 25px 0 rgba($color: #000000, $alpha: 0.2), 10px 10px 25px 0 rgba($color: #000000, $alpha: 0.2);

      color: $color-green;
      text-transform: uppercase;
      font-weight: bold;

      .category-img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        max-height: 140px;

      }

      .card-text {
        font-size: .8rem;
      }

      &:hover {
        transform: scale(1.1);
        box-shadow: -12px -12px 30px 0 #fff9f3, 12px 12px 30px 0 #a29992;

        background-color: $color-green;
        color: $color-cream;
      }
    }
  }

  .selected .card-category {
    transform: scale(1.1);
    background-color: $color-green;
    color: $color-cream;
  }


}

// ----------------------------------------------------

@media (max-width: 1399px) {
  .jumbotron {
    .welcome_text {
      h1 {
        font-size: 50px;
      }
    }

    .my-btn {
      margin: 20px;
      padding: 10px 18px;
      font-size: 25px;
    }
  }

  section {
    .do-you {
      font-size: 50px;
    }

    .full-card {
      .card-category {
        .category-img {
          max-height: 122px;
        }
      }
    }

  }


}

@media (max-width: 1199px) {
  .jumbotron {
    .welcome_text {
      h1 {
        font-size: 50px;
      }
    }

    .my-btn {
      margin: 20px;
      padding: 10px 18px;
      font-size: 25px;
    }
  }

  section {
    .do-you {
      font-size: 50px;
    }

    .full-card {
      .card-category {
        .category-img {
          max-height: 100px;
        }
      }
    }
  }
}




@media (max-width: 992px) {
  .jumbotron {
    // height: calc(100vh - 80px);

    .welcome_text {
      h1 {
        font-size: 45px;
      }
    }

    .my-btn {
      margin: 20px;
      padding: 10px 18px;
      font-size: 25px;
    }
  }


}



@media (max-width: 991px) {
  .jumbotron {
    // height: calc(100vh - 300px);
    padding-top: 25px;

    .welcome_text {
      transform: rotate(20deg);
      -webkit-animation: slide 0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275) 0.7s both;
      animation: slide 0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275) 0.7s both;

      @-webkit-keyframes slide {
        0% {
          -webkit-transform: translateX(100vw);
          transform: translateX(100vw);
        }

        100% {
          -webkit-transform: translateX(-100px);
          transform: translateX(-100px);
        }
      }

      @keyframes slide {
        0% {
          -webkit-transform: translateX(100vw);
          transform: translateX(100vw);
        }

        100% {
          -webkit-transform: translateX(0px);
          transform: translateX(0px);
        }
      }

      h1 {
        font-size: 50px;
        height: 110%;

      }
    }

    .my-btn {
      margin: 20px;
      padding: 7px 13px;
      font-size: 18px;

      display: none;
    }
  }

  section {
    .do-you {
      font-size: 35px;
    }

    .full-card {
      .card-category {
        .category-img {
          max-height: 100px;
        }
      }
    }
  }
}

@media (max-width: 767px) {
  .jumbotron {
    // height: calc(100vh - 600px);
    padding-top: 25px;

    .welcome_text {
      transform: rotate(20deg);
      -webkit-animation: slide 0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275) 0.7s both;
      animation: slide 0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275) 0.7s both;

      @-webkit-keyframes slide {
        0% {
          -webkit-transform: translateX(100vw);
          transform: translateX(100vw);
        }

        100% {
          -webkit-transform: translateX(-100px);
          transform: translateX(-100px);
        }
      }

      @keyframes slide {
        0% {
          -webkit-transform: translateX(100vw);
          transform: translateX(100vw);
        }

        100% {
          -webkit-transform: translateX(0px);
          transform: translateX(0px);
        }
      }

      h1 {
        font-size: 35px;
        height: 110%;

      }
    }
  }

  .my-btn {
    margin: 20px;
    padding: 7px 13px;
    font-size: 18px;

    display: none;
  }
}

section {
  .do-you {
    font-size: 30px;
  }

}

@media (max-width: 320px) {
  .jumbotron {
    // height: calc(100vh - 600px);
    padding-top: 25px;

    .welcome_text {
      h1 {
        font-size: 30px;
      }
    }

    .my-btn {
      margin: 20px;
      padding: 7px 13px;
      font-size: 18px;

      display: none;
    }
  }
}
</style>