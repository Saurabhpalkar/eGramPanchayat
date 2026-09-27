<script setup lang="ts">
import GlobalVoiceAssistant from './components/common/GlobalVoiceAssistant.vue'
</script>
<template>
  <div id="egram-app">
    <router-view />
    <GlobalVoiceAssistant />    
  </div>
</template>

<script setup lang="ts">
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
@import './index.css';
</style>
