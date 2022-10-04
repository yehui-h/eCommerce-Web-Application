import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Axios from "axios";

import VueSlider from "vue-slider-component";
Vue.component("VueSlider", VueSlider);

import "./plugins/element.js";
import homeState from "./components/homeState.vue";
import searchState from "./components/searchState";
import itemState from "./components/itemState";
import itemDescription from "./components/itemDescription";
import itemCart from "./components/itemCart";
//import uniqueBrands from './assets/js/mainView'

Vue.config.productionTip = false;
Vue.component("homeState", homeState);
Vue.component("searchState", searchState);
Vue.component("itemState", itemState);
Vue.component("itemDescription", itemDescription);
Vue.component("itemCart", itemCart);

Axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
Axios.defaults.headers.get["Content-Type"] =
  "application/x-www-form-urlencoded";
Axios.defaults.transformRequest = [
  function (data) {
    let ret = "";
    for (let it in data) {
      ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
    }
    return ret;
  },
];

Axios.defaults.baseURL = "http://localhost:3000";
Vue.prototype.$axios = Axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
