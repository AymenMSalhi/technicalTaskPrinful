//import Vue from 'vue';
//import Router from 'vue-router';

import { createApp } from 'vue'
import App from './App.vue'
//import HelloWorld from './components/HelloWorld.vue';

//Vue.use(Router);

/*export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: 'app',
            component: App
        },
        {
            path: "/start",
            name: 'app',
            component: App
        },
        {
            path: "/test/:id",
            name: 'helloworld',
            component: HelloWorld
        }
    ]
})*/

createApp(App).mount('#app')
