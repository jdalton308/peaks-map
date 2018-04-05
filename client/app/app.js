import '../index.html'; // easiest way to get webpack to serve it

import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import InitialStore from './store';
import './assets/style/app.scss';


// Map Library
import 'leaflet/dist/leaflet.css';


// Chart Library
import VueHighcharts from 'vue-highcharts';
Vue.use(VueHighcharts);


// Vuex
Vue.use(Vuex);
const store = new Vuex.Store(InitialStore);



new Vue({
  store,
  el: '#app',
  render: h => h(App)
});
