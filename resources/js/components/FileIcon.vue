<template>
<svg xmlns="http://www.w3.org/2000/svg" :width="width" height="24" id="mdi-account-minus" viewBox="0 0 24 24">
<path v-if="mime==='image/svg+xml'" d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M1,10V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
</svg>
</template>
<script setup>
import { defineProps, computed } from 'vue';
// import { extension, lookup } from 'mime-to-extensions';
// import Mime from '@­/mime-types-vue/src/index.js';
import Mime from '../mime-types-vue/index.js';
// console.log(Mime.lookup('jpeg'));
const props = defineProps({
	width: {
		type: Number,
		default: 24
	},
	height: {
		type: Number,
		default: 24
	},
	file: {
		type: String,
		default: ''
	},
	extension: {
		type: String,
		default: ''
	},
	mime: {
		type: String
	}
});
const mime = computed(() => {
	if (props.mime) {
		return props.mime;
	}
	return Mime.lookup(props.extension || props.file);
});
</script>