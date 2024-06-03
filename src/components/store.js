import { reactive } from "vue";
export const store = reactive({
    //array in cui salviamo i piatti
    Cart: {
        items: [],
        total: 0
    },

})