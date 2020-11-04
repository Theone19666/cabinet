<template>
	<v-layout>
		<v-container>
			<v-data-table
				:headers="headers"
				:items="contacts"
				:search="search"
				:singleSelect="false"
				item-key="id"
			>
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>Список контактов</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn @click="logOut">Выйти</v-btn>
					</v-toolbar>
					<v-toolbar flat>
						<v-text-field
							v-model="search"
							append-icon="mdi-magnify"
							label="Поиск"
							single-line
							hide-details
						></v-text-field>
						<v-spacer></v-spacer>
						<v-dialog v-model="dialog" max-width="500px" @click:outside="close">
							<template v-slot:activator="{ on, attrs }">
								<v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on"> Добавить </v-btn>
							</template>
							<v-card>
								<v-card-title>
									<span class="headline">{{ formTitle }}</span>
								</v-card-title>

								<v-card-text>
									<v-container>
										<v-form @submit.prevent ref="form">
											<v-row>
												<v-col cols="12">
													<v-text-field
														v-model="editedItem.name"
														label="Имя"
														:rules="rules"
													></v-text-field>
												</v-col>
												<v-col cols="12">
													<v-text-field
														v-model="editedItem.surname"
														label="Фамилия"
														:rules="rules"
													></v-text-field>
												</v-col>
												<v-col cols="12">
													<v-text-field
														v-model="editedItem.patronymic"
														label="Отчество"
														:rules="rules"
													></v-text-field>
												</v-col>
												<v-col cols="12">
													<v-text-field
														v-model="editedItem.phone"
														label="Телефон"
														type="phone"
														:rules="rules"
														v-mask="'+7(###)-###-##-##'"
													></v-text-field>
												</v-col>
											</v-row>
										</v-form>
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="close"> Отменить </v-btn>
									<v-btn color="blue darken-1" text @click="save"> Сохранить </v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogDelete" max-width="500px">
							<v-card>
								<v-card-title class="headline"
									>Вы действительно хотите удалить этот контакт?</v-card-title
								>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="closeDelete">Отменить</v-btn>
									<v-btn color="blue darken-1" text @click="deleteItemConfirm">Да</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-toolbar>
				</template>
				<template #item.actions="{ item }">
					<v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
					<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
				</template>
			</v-data-table>
		</v-container>
		<v-alert type="success" v-if="success" class="message">{{ success }}</v-alert>
		<v-alert type="error" v-if="error" class="message">{{ error }}</v-alert>
	</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Route from "vue-router";
import { mapActions, mapState } from "vuex";
import { IContacts } from "../../interfaces";
import { namespace } from "./store";

import getAuthInfo from "../../utils";

@Component({
	computed: mapState(namespace, ["contacts"]),
	methods: mapActions(namespace, ["loadContacts", "addContact", "deleteContact", "editContact"]),
})
export default class Contacts extends Vue {
	contacts!: IContacts[];

	success = "";

	error = "";

	search = "";

	dialog = false;

	dialogDelete = false;

	editedIndex = -1;

	editedItem = {
		name: "",
		surname: "",
		patronymic: "",
		phone: "",
	};

	defaultItem = {
		name: "",
		surname: "",
		patronymic: "",
		phone: "",
	};

	headers = [
		{
			text: "Имя",
			value: "name",
		},
		{ text: "Фамилия", value: "surname" },
		{ text: "Отчество", value: "patronymic" },
		{ text: "Телефон", value: "phone" },
		{ text: "", value: "actions", sortable: false },
	];

	rules = [(v: string) => !!v || "Поле обязательно для заполнения"];

	get formTitle() {
		return this.editedIndex === -1 ? "Добавление контакта" : "Редактирование контакта";
	}

	loadContacts!: Function;

	addContact!: Function;

	editContact!: Function;

	deleteContact!: Function;

	editItem(item: IContacts) {
		this.editedIndex = this.contacts.indexOf(item);
		this.editedItem = { ...item };
		this.dialog = true;
	}

	deleteItem(item: IContacts) {
		this.editedIndex = item.id;
		this.editedItem = { ...item };
		this.dialogDelete = true;
	}

	deleteItemConfirm() {
		this.deleteContact(this.editedIndex)
			.then((resp: boolean) => {
				if (resp) {
					this.closeDelete();
					this.success = "Контакт успешно удалён";
					setTimeout(() => (this.success = ""), 3000);
				} else {
					this.error = "При удалении контакта произошла ошибка";
					setTimeout(() => (this.error = ""), 3000);
				}
			})
			.catch(() => {
				this.error = "При удалении контакта произошла ошибка";
				setTimeout(() => (this.error = ""), 3000);
			});
	}

	close() {
		this.dialog = false;
		this.$nextTick(() => {
			this.editedItem = { ...this.defaultItem };
			this.editedIndex = -1;
		});
	}

	closeDelete() {
		this.dialogDelete = false;
		this.$nextTick(() => {
			this.editedItem = { ...this.defaultItem };
			this.editedIndex = -1;
		});
	}

	logOut() {
		localStorage.removeItem("authInfo");
		this.$router.push({ name: "auth" });
	}

	get method() {
		if (this.editedIndex > -1) {
			return this.editContact;
		}
		return this.addContact;
	}

	save() {
		const validate = this.$refs.form.validate();
		if (validate) {
			this.method(this.editedItem)
				.then((resp: boolean) => {
					if (resp) {
						this.close();
						// prettier-ignore
						this.success = this.editedIndex > -1 ? "Контакт успешно обновлён" : "Контакт успешно добавлен";
						setTimeout(() => (this.success = ""), 3000);
					} else {
						this.error = "Произошла ошибка";
						setTimeout(() => (this.error = ""), 3000);
					}
				})
				.catch(() => {
					this.error = "Произошла ошибка";
					setTimeout(() => (this.error = ""), 3000);
				});
		}
	}

	beforeRouteEnter(_to: Route, _from: Route, next: Function) {
		const authInfo = getAuthInfo();
		if (!authInfo?.id) {
			next({ name: "auth" });
		} else {
			next();
		}
	}

	created() {
		this.loadContacts().catch((error: Error) => {
			this.error = error.message;
			setTimeout(() => (this.error = ""), 3000);
		});
	}
}
</script>
<style lang="scss" scoped>
.message {
	position: fixed;
	right: 0;
	bottom: 0;
	min-width: 300px;
	z-index: 999;
}
</style>
