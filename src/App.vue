<script>

import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import { store } from "./components/store" 

export default{

  data() {
    return{
      apiImageUrl: 'http://127.0.0.1:8000/storage/',
      store,
           
    }
  },


  components:{
    AppHeader,
    AppFooter,
  },

  mounted(){

        
  }

}
</script>

<template>

  <AppHeader></AppHeader>

  <div class="box">
    <div v-if="$route.path ==  '/'" class="wave-box">
      <img class="wave-top" :src="apiImageUrl + 'branding/svg.png'" alt="@">
    </div>

    <router-view></router-view>
  </div>

  <AppFooter></AppFooter>
  
</template>



<style scoped>


.box{

  position: relative;
  background-color: #f8ebde;
  
  height: 100%;
  min-height: 800px;
  
  .wave-box{
    position: absolute;
    width: 100%;

    top: -1px;
    left: 0;
    right: 0;
  
    .wave-top{
      width: 100%;
      height: 100%;
      transform: rotate(180deg);
        
    }

    
  }
  
}

</style>
