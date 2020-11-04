import Vue from "vue";
import VueMask from "v-mask";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(VueMask);

new Vue({
	vuetify,
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
