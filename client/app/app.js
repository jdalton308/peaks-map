import '../index.html'; // easiest way to get webpack to serve it

import Vue from 'vue';
import App from './App.vue';

// Map Library
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

// Chart Library
import VueHighcharts from 'vue-highcharts';

Vue.use(VueHighcharts);


new Vue({
  el: '#app',
  render: h => h(App)
});
