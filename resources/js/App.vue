<template>
    <div>
        <ul>
            <li v-for="file, i in files" :key="i">
                <a href="">
                    <file-icon :file="file.name" />
                    {{ file.name }}
                </a>
            </li>
        </ul>
    </div>
</template>
<script setup>
import FileIcon from './components/FileIcon.vue';

import { onMounted, ref } from 'vue';
import File from './models/File.js';

const files = ref([]); // or reactive([])

onMounted(async () => {
    files.value = await File.all();
});

const props = defineProps({
    msg: String
});
</script>
