<template>
  <div></div>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$router.replace(from.fullPath);
    });
  },
});
</script>
<script setup lang="ts"></script>

<style scoped></style>
