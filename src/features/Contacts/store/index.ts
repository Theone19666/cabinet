import Vue from "vue";
import { IContacts, IStore, IObject } from "./../../../interfaces";
import getAuthInfo from "../../../utils";

export const namespace = "contacts";

export default {
	namespaced: true,
	state: {
		contacts: [] as IContacts[],
	},
	mutations: {
		loadContacts: (state: IStore, payload: IContacts[]) => {
			state.contacts = payload;
		},
		addContact: (state: IStore, payload: IContacts) => {
			state.contacts.push(payload);
		},
		editContact: (state: IStore, payload: IContacts) => {
			const editiedContactIndex = state.contacts.findIndex(
				(item: IContacts) => item.id === payload.id
			);
			Vue.set(state.contacts, editiedContactIndex, payload);
		},
		deleteContact: (state: IStore, id: number) => {
			const editiedContactIndex = state.contacts.findIndex((item: IContacts) => item.id === id);
			state.contacts = [
				...state.contacts.slice(0, editiedContactIndex),
				...state.contacts.slice(editiedContactIndex + 1),
			];
		},
	},
	actions: {
		loadContacts: async (context: IObject) => {
			const accountid = getAuthInfo()?.id;
			if (!accountid) throw new Error("Отсутствует авторизация");
			return fetch(`http://localhost:3000/auth/${accountid}/contacts`)
				.then((response) => {
					if (response.ok) {
						return response.json();
					}
					throw new Error("Ошибка при получении контактов");
				})
				.then((resp: IContacts[]) => {
					context.commit("loadContacts", resp);
				})
				.catch((error) => {
					throw new Error(error);
				});
		},
		addContact: async (context: IObject, payload: IContacts) => {
			const accountid = getAuthInfo()?.id;
			if (!accountid) throw new Error("Отсутствует авторизация");
			const requestAtts = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			};
			return fetch(`http://localhost:3000/auth/${accountid}/contacts`, requestAtts)
				.then((resp) => {
					if (resp.ok) {
						return resp.json();
					}
					throw new Error("ошибка");
				})
				.then((resp: IContacts) => {
					context.commit("addContact", resp);
					return true;
				})
				.catch(() => {
					throw new Error();
				});
		},
		editContact: async (context: IObject, payload: IContacts) => {
			const accountid = getAuthInfo()?.id;
			if (!accountid) throw new Error("Отсутствует авторизация");
			const requestAtts = {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			};
			return fetch(`http://localhost:3000/auth/${accountid}/contacts/${payload.id}`, requestAtts)
				.then((resp) => {
					if (resp.ok) {
						return resp.json();
					}
					throw new Error("ошибка");
				})
				.then((resp: IContacts) => {
					context.commit("editContact", resp);
					return true;
				})
				.catch(() => {
					throw new Error();
				});
		},
		deleteContact: async (context: IObject, id: number) => {
			const accountid = getAuthInfo()?.id;
			if (!accountid) throw new Error("Отсутствует авторизация");
			const requestAtts = {
				method: "DELETE",
			};
			return fetch(`http://localhost:3000/auth/${accountid}/contacts/${id}`, requestAtts)
				.then((resp) => {
					if (resp.ok) {
						context.commit("deleteContact", id);
						return true;
					}
					return false;
				})
				.catch(() => {
					throw new Error();
				});
		},
	},
};
