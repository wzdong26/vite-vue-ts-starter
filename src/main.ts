import { App, createApp } from 'vue';
import AppVue from './App.vue';
import router from './router';
import { createPinia, Pinia } from 'pinia';

import fullscreen from '@/utils/fullscreen'

const app: App<Element> = createApp(AppVue);
const pinia: Pinia = createPinia()

app.use(router);
app.use(pinia);

app.directive('fullscreen', fullscreen)
app.mount('#app');
