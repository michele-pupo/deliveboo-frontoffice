<script>

export default {
  name: "AppRestaurant",
  name:"AppCart",

  props: {
    restaurants: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      apiImageUrl: 'http://127.0.0.1:8000/storage/',
    }
  },

  computed: {
    restaurantText() {
      const count = this.restaurants.length;
         if (count === 1) {
        return "One Restaurant";
      } else if (count > 1) {
        return "Restaurants";
      }
    },

    restaurantCount() {
      return this.restaurants.length > 1 ? this.restaurants.length : '';
    }
  }
}
</script>

<template>
  <div class="container pt-5">
    <div class="d-flex justify-content-center" v-if="restaurants.length === 0">
      <div class="col-12 col-md-6">
        <img class="thinking woman " :src="apiImageUrl + 'branding/avatar.svg'" alt="">
      </div>
      <div class="col-6 col-md-6 d-none d-md-flex justify-content-end ">
        <img class="thinking man " :src="apiImageUrl + 'branding/avatar1.svg'" alt="">
      </div>
      
    </div>
    <strong class="text-center mb-3">{{ restaurantCount }} {{ restaurantText }}</strong>
    <div class="row">
      <div v-for="restaurant in restaurants" :key="restaurant.id" class="col-md-6 col-lg-4 mb-4 z-3">
        <router-link :to="{ name: 'restaurant', params: { id: restaurant.id }}" class="text-decoration-none" >
          <div class="restaurant-card h-100 pb-5 rounded-5">
            <img :src="apiImageUrl + restaurant.img_res" class="card-img-top h-75 object-fit-cover rounded-top-5 bg-light" :alt="restaurant.name_res">
            <div class="description position-relative">
              <h3 class="pt-3">{{ restaurant.name_res }}</h3>
              <span>address: {{ restaurant.address_res }}</span>
              <div class="categories text-center position-absolute">
                <div class="square position-absolute"></div>
                <span v-for="category in restaurant.categories" :key="category.id" class="badge">{{ category.name }}</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../styles/variables' as *;

  .thinking{
    width: 75%;
  }

  .restaurant-card {
    padding: 1px;
    background-color:$color-cream;
    border: #d5c9c0eb 1px solid;
    
    box-shadow: -10px -10px 30px 0 #fff9f3,10px 10px 30px 0 #a29992;

  }

  .card-img-top {
    width: 100%;
    display: block;
    border-radius: 5px 5px 0 0;


  }

  .description {
    padding: 15px;
    color:$color-green ;
  }

  .categories{
    background-color: $color-red;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    transition: width .2s linear;

    height: 20px;
    width: 25px;
    right: 0;
    top: 5px;

    .square{
      background-color: $color-cream;
      height: 16px;
      width: 16px;
      position: relative;

      left: -7px;
      transform: rotate(45deg);
    }

    .badge {
      margin-left: 5px;
      display: none;
    }

    &:hover{
      width: 90%;

      .badge{
        display: inline;
      }
    }
  }
  
</style>