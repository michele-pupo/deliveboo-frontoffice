<script>

export default {
    name: 'AppFooter',
}


</script>


<template>
    <footer id="footer">
        <div class="my-footer d-flex align-items-center justify-content-center flex-column">
            <div class="row w-100 pt-4 p-4 d-flex flex-wrap justify-content-center gap-3">

                <!-- Colonna 1 -->
                <div class="my-col col-sm-4 col-md-4 col-lg-2 col-12 p-3 text-center mb-4 ">
                    <h5 class="text-uppercase">Discover Deliveboo</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-white text-decoration-none ">Who we are</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Restaurants</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Design</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Become our partner</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Programmig</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Work with us</a></li>
                    </ul>
                </div>

                <!-- Colonna 2 -->
                <div class="my-col col-sm-4 col-md-4 col-lg-2  col-12 p-3 text-center mb-4">
                    <h5 class="text-uppercase">Legal Notices</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-white text-decoration-none ">Terms and Conditions</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Privacy Police</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Cookies</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Classificatio of partners</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Requests from the authorities</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Public</a></li>
                    </ul>
                </div>

                <!-- Colonna 3 -->
                <div class="my-col col-sm-4 col-md-4 col-lg-2 col-12 p-3 text-center mb-4">
                    <h5 class="text-uppercase">Help</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-white text-decoration-none ">Contacts</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">FAQ</a></li>
                        <li><a href="#" class="text-white text-decoration-none ">Types of cuisine</a></li>
                    </ul>
                </div>

                <!-- colonna 4 -->
                <div class="my-col col-sm-4 col-md-4 col-lg-2 col-12 p-3 text-center mb-4 d-flex justify-content-center">
                    <div class="text-center">
                        <h5 class="text-uppercase">DOWNLOAD APP</h5>
                        <div class="d-flex gap-3 flex-column align-items-center " >
                            <img class="small-image w-50  " :src="'http://localhost:8000/storage/' + 'download_images/appstore.png'" alt="App Store">
                            <img class="small-image w-50  " :src="'http://localhost:8000/storage/' + 'download_images/playstore.png'" alt="App Store">
                        </div>
                    </div>
                </div>

            </div>

            <div class="row d-flex pb-5 w-100 justify-content-center align-items-center ">
                <div class="col-12 col-sm-6 pt-4 d-flex justify-content-center align-items-center  ">
                    <div class="text-center">
                        <h5 class="text-uppercase">COPYRIGHT</h5>
                        <p class="mb-0">© 2024 Deliveboo. Developed by MLMSM</p>
                    </div>
                </div>
                
                <div class="col-12 col-sm-6 pt-4 d-flex flex-column justify-content-start align-items-center ">
                    <div class="text-center ">
                        <h5 class="text-uppercase">FOLLOW US</h5>
                        <div class="box-icon d-flex justify-content-around gap-4">
                            <i class=" fa-brands fa-square-facebook "></i>
                            <i class=" fa-brands fa-square-x-twitter "></i>
                            <i class=" fa-brands fa-square-instagram "></i>
                            <i class=" fa-brands fa-linkedin "></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>


<style lang="scss" scoped>
@use '../styles/variables' as *;

.my-footer {
    min-height: 450px;
    background-color: #f3ad6c;

    .my-col{
        border-radius: 25px;
        box-shadow: -10px -10px 30px 0 #fec57f,10px 10px 30px 0 #cc894c;
        border: 1px solid #f3ad6c ;

        
    }

    h5{
        color:#713616;

        font-family: $mibery-font;
        text-align: center; 
    }
    
    a, p{
        font-family: "Open Sans", sans-serif;
        font-optical-sizing: auto;
    }
}

.small-image{
    
       
      &:hover{

        cursor: pointer;
       
    }
}

.box-icon{

    i:nth-of-type(1):hover{
        color: #1877f2;
    }
    i:nth-of-type(2):hover{
   
        color: #000000;
    }
    i:nth-of-type(3):hover{
        color: rgb(176, 39, 194);
    }
    i:nth-of-type(4):hover{
        color: #0077B5;
    }

    i {
        cursor: pointer;
        font-size: 25px;
        transition: .2s linear;
    
        &:hover{
            
        transition: transform 0.3s ease, background-color 0.3s ease;
        border-radius: 3px;
        transform: scale(1.2);
    
    
    }
}



}
</style>
