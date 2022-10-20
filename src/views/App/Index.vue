<script setup lang="ts">
import { ref } from 'vue';

const txt = ref('Login success! Turn to')
</script>
    
<template>
    <div>{{txt}} <span>{{$route.meta.title}}</span></div>
</template>
    
<style scoped>

</style>
