<script setup lang="ts">
import { ref } from 'vue';

const txt = ref('There is Login Page')
</script>
    
<template>
    <div>{{txt}}</div>
    <button @click="() => $router.push({name: 'app'})">Login</button>
</template>
    
<style scoped>

</style>
    