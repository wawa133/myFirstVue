<template>
  <div v-if="userStore.network">
    <h3>我没网了</h3>
    <div @click="onRefresh">刷新</div>
  </div>
</template>

<script setup lang="ts" name="networkDownLine">
import { useUserStore } from "../stores";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const onRefresh = () => {
  router.replace("/refresh");
};
</script>

<style scoped></style>
