import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { Component } from "vue-property-decorator";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: "/",
		component: () => import(/* webpackChunkName: "contacts" */ "../features/Contacts/Contacts.vue"),
	},
	{
		path: "/auth",
		name: "auth",
		// prettier-ignore
		component: () => import(/* webpackChunkName: "auth" */ "../features/Authorization/Authorization.vue"),
	},
	{
		path: "/contacts",
		name: "contacts",
		component: () => import(/* webpackChunkName: "contacts" */ "../features/Contacts/Contacts.vue"),
	},
	{
		path: "*",
		component: () => import(/* webpackChunkName: "notfound" */ "../components/NotFound.vue"),
	},
];

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate", "beforeRouteLeave"]);

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
