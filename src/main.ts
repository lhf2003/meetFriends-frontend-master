import {createApp, ref} from 'vue';
import App from './App.vue';
import * as VueRouter from 'vue-router';
import routes from './config/route';
import Vant from 'vant';
import 'vant/lib/index.css';
import '../global.css';
import BasicLayout from "./layouts/BasicLayout.vue";

const app = createApp(App);
app.use(Vant);
app.component('BasicLayout', BasicLayout);

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
});

app.use(router);
app.mount('#app');
