<template>
	<v-input :placeholder="placeholder" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Input extends Vue {
	@Prop({ type: String, default: "" }) placeholder!: string;
}
</script>
