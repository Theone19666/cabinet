<template>
	<div class="layout auth-layout">
		<div class="container auth-container pa-6">
			<v-form @submit.prevent="submit" ref="form">
				<h1>Вход</h1>
				<v-row>
					<v-col>
						<v-text-field
							label="Логин"
							required
							:rules="rules"
							color="#ffffff"
							:dark="true"
							v-model="login"
						></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-text-field
							label="Пароль"
							required
							:rules="rules"
							color="#ffffff"
							type="password"
							:dark="true"
							v-model="password"
						></v-text-field>
					</v-col>
				</v-row>
				<v-alert type="error" v-if="error" class="error">{{ error }}</v-alert>
				<v-btn type="submit" width="100%" color="white"> Войти </v-btn>
			</v-form>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IAuth } from "../../interfaces";

import getAuthInfo from "../../utils";

@Component
export default class Authorization extends Vue {
	@Prop({ type: String, default: "" }) placeholder!: string;

	rules = [(v: string) => !!v || "Поле обязательно для заполнения"];

	login = "";

	password = "";

	error = "";

	submit() {
		const validate = this.$refs.form.validate();
		if (validate) {
			this.getAuth();
		}
	}

	recordAuth(id: number) {
		const authInfo = JSON.stringify({ id });
		localStorage.setItem("authInfo", authInfo);
	}

	getAuth() {
		fetch(`http://localhost:3000/auth/`)
			.then((response) => {
				return response.json();
			})
			.then((resp) => {
				const person = resp?.find(
					(item: IAuth) => item.login === this.login && item.password === this.password
				);
				if (person) {
					this.recordAuth(person.id);
					this.$router.push({ name: "contacts" });
				} else {
					this.error = "Введите правильный логин/пароль";
					setTimeout(() => (this.error = ""), 3000);
				}
			})
			.catch(() => {
				this.error = "Произошла ошибка при авторизации";
				setTimeout(() => (this.error = ""), 3000);
			});
	}

	beforeRouteEnter(_to: Route, _from: Route, next: Function) {
		const authInfo = getAuthInfo();
		if (authInfo?.id) {
			next({ name: "contacts" });
		} else {
			next();
		}
	}
}
</script>

<style lang="scss" scoped>
.auth-layout {
	height: 100%;
	justify-content: center;
	align-items: center;
}
.auth-container {
	max-width: 400px;
	background-color: darkseagreen;
	color: white;
	text-align: center;
}
</style>
