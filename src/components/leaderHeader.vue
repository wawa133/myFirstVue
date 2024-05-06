<template>
  <!-- <div > -->
  <div class="icon">
    <div class="iconImg"><img src="@/assets/images/leader.jpg" alt="" /></div>
    <div class="icoCon">
      <p>
        {{ !!userStore.unitData[1] ? userStore.unitData[1].name : "未注册用户" }}
      </p>
      <h2>{{ userStore.nickName }}</h2>
    </div>
  </div>
  <div class="headerTitle">
    <h2>{{ Props.title }}</h2>
  </div>
  <div class="header-btns">
    <lay-button type="danger" @click="() => router.push('/')"> 返回首页 </lay-button>
    <lay-button type="danger" @click="() => router.push('/UserRegistration')">
      注册账号
    </lay-button>
  </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores";

const userStore = useUserStore();
const router = useRouter();
const Props = defineProps(["title"]);

onMounted(() => {
  //loadUnitDataSource(page);
  //tableData.value = [...userStore.unitData];
  //change(page);
});
</script>

<style scoped>
/* 头部导航图标文字式样 */
.icon {
  width: 250px;
  height: 60px;
  margin-left: 25px;
  margin-top: 20px;
  display: flex;
}

.icon .iconImg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 6px rgba(255, 255, 255, 0.3);
  /* overflow: hidden; */
}

.icon .iconImg img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.icon .icoCon {
  width: 200px;
  height: 60px;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}

.headerTitle {
  color: #fff;
  font-weight: 700;
}

.icon .icoCon p {
  padding-top: 5;
}

.icon .icoCon h2 {
  font-weight: 400;
}

/* 头部导航按钮式样 */
.header-btns {
  height: 38px;
  display: flex;
  justify-content: space-around;
  margin-right: 25px;
  margin-top: 22px;
}

.header-btns:deep(.layui-btn-danger) {
  background: rgba(255, 255, 255, 0.1);
  border: none;
}
</style>
