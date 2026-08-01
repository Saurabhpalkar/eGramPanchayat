<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <AppNavbar />
    <div class="d-flex flex-grow-1">
      <div class="d-none d-lg-block">
        <Sidebar />
      </div>
      <main class="flex-grow-1 p-3 p-md-4 overflow-x-hidden pb-5 pb-lg-3">
        <router-view />
      </main>
    </div>
    <MobileBottomNav />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '../components/common/AppNavbar.vue';
import Sidebar from '../components/common/Sidebar.vue';
import MobileBottomNav from '../components/common/MobileBottomNav.vue';
</script>
