<template>
  <div class="LeftMenu">
    <div class="menuItem">
      <div class="changeButton">
        <div
          class="btnItem"
          :class="{ btnItem1: AreaLeaderT, btnItem2: !AreaLeaderT }"
          @click="ChangeAreaLeaderClass"
        ></div>
        <div
          class="btnItem"
          :class="{ btnItem1: AreaLeaderT, btnItem2: !AreaLeaderT }"
          @click="ChangeAreaLeaderClass"
        ></div>
        <div
          class="btnItem"
          :class="{ btnItem1: AreaLeaderT, btnItem2: !AreaLeaderT }"
          @click="ChangeAreaLeaderClass"
        ></div>
      </div>
    </div>
    <div class="line"></div>
    <!-- 区域下面子选单 -->
    <div v-if="AreaLeaderT">
      <!-- 区域选择列表 -->
      <div class="title">
        <p>菜单选项</p>
      </div>
      <div class="navAreaLeader">
        <div
          class="menuItem"
          v-for:="(data, key) in mainMenu"
          :key="data.id"
          @click="areaNavClick(key)"
        >
          <div class="light"></div>
          <div class="lIcon">
            <span class="iconFont" :class="NavIcon[key]"></span>
          </div>
          <div class="context">{{ data.name }}</div>
          <div class="ricon">
            <span class="iconFont" :class="NavIcon[key]"></span>
          </div>
        </div>
      </div>
      <!-- 可选区域列表 -->
      <div class="line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { useUserStore } from "@/stores";
import unitInfo from "@/api/unitInfo";
import areaInfor from "@/api/areaInfor";

const userStore = useUserStore();
const addTab = defineProps(["addTab"]);

const AreaLeaderT = ref(true);
// 数据表页导航条变量
const pageArea = reactive({ current: 1, limit: 50, total: 100 });
const pageUnit = reactive({ current: 1, limit: 50, total: 100 });

//=============================
const mainMenu = ref<Array<mainMenuType>>([
  {
    id: 1,
    name: "首页",
    action: "首页",
    desc: "首页",
    lev: 1,
  },
  {
    id: 2,
    name: "管理两个名单",
    action: "管理名单",
    desc: "管理两个名单",
    lev: 1,
  },
  {
    id: 3,
    name: "管理主体名录",
    action: "管理名录",
    desc: "管理主体名录",
    lev: 1,
  },
]);
interface mainMenuType {
  id: number;
  name: string;
  action: string;
  desc: string;
  lev: number;
}

// 定义区域导航选单数据变量【导航栏】
const areaData = ref<Array<areaDataType>>([]);
interface areaDataType {
  id: number;
  name: string;
  desc: string;
  lev: number;
}
// 定义网页表格数据数组变量【表格】
let unitData = ref<Array<unitDataType>>([]);
interface unitDataType {
  id: number;
  areaId: number;
  name: string;
  desc: string;
  city: string;
  lev: number;
}

onMounted(() => {
  userStore.leaderAreaData = [...userStore.areaData];
  userStore.leaderUnitData = [...userStore.unitData];
  loadAreaDataSource();
});

// 使用计算属性来获取 store 中的状态
const leaderUnitState = computed(() => userStore.leaderUnitData);
watch(leaderUnitState, () => loadUnitDataSource(), { deep: true });
const leaderAreaState = computed(() => userStore.leaderAreaData);
watch(
  leaderAreaState,
  () => {
    loadAreaDataSource();
    loadUnitDataSource();
  },
  { deep: true }
);

// 区域|单位显示切换函数
const ChangeAreaLeaderClass = function (e: any) {
  if (e === null) return;
  if (!e.target.classList.contains("btnItem1")) {
    AreaLeaderT.value = !AreaLeaderT.value;
  }
};

// 左侧树形结构导航点击事件
const areaNavClick = (sn: any) => {
  //console.log(mainMenu.value[sn]);
  addTab.addTab({
    id: mainMenu.value[sn].id,
    title: mainMenu.value[sn].desc,
    action: mainMenu.value[sn].action,
  });
};

//{data: resData, total: resPage}
// 从后台获取单位相关数据源【单位】
const loadUnitDataSource = () => {
  unitInfo.get({
    areaData: userStore.leaderAreaData,
    unitData: userStore.leaderUnitData,
    pageData: pageUnit,
    callBack: (params: any) => {
      unitData.value = [...params.data];
      pageUnit.total = params.total;
    },
  });
};

//areaInfor.get({ areaData: areaData, pageData: page });
// 从后台获取数据源【区域】
const loadAreaDataSource = () => {
  areaInfor.get({
    areaData: userStore.leaderAreaData,
    pageData: pageArea,
    callbackLoadArea: (res: { data: any; total: number }) => {
      areaData.value = res.data;
      pageArea.total = res.total;
    },
  });
};

// 导航图标
const NavIcon = reactive([
  "icon-th",
  "icon-th-list",
  "icon-th-large",
  "icon-folder-empty",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
]);
</script>

<style scoped>
/* 左侧菜单栏样式 */
.LeftMenu {
  /* width: 120px; */
  width: 400px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  border-right: 1px solid rgba(44, 44, 44, 0.5);
  box-shadow: 13px 18px 20px 1px rgb(0 0 0 / 32%); /* 添加阴影效果 */
  transition: 0.5s;
  color: rgba(255, 255, 255, 0.6);
  overflow: hidden;
}

.LeftMenu:hover {
  width: 400px;
}

.LeftMenu:hover .line {
  width: 230px;
}

.LeftMenu:hover .con {
  width: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}

.LeftMenu:hover .ricon {
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}

/* 左侧菜单项式样 */
.LeftMenu .menuItem {
  display: flex;
  position: relative;
  transition: 0.5s;
  border-radius: 6px;
  cursor: pointer;
}

.LeftMenu .menuItem:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 左侧菜单项-菜单项左鼠标选中图示 */
.LeftMenu .menuItem:hover .light {
  opacity: 1;
}

/* 左侧切换图形按钮 */
.changeButton {
  width: 60px;
  height: 15px;
  display: flex;
  justify-content: space-around;
  margin-left: 25px;
  margin-top: 25px;
}

.changeButton .btnItem {
  width: 15px;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #fff;
}

.changeButton .btnItem1 {
  background: #62cb44;
}

.changeButton .btnItem2 {
  background: rgba(0, 0, 0, 0.7);
}

.changeContext {
  /* width: 0; */
  width: 160px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  overflow: hidden;
  position: relative;
  left: 0px;
  opacity: 0;
}

.LeftMenu:hover .changeContext {
  width: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}

/* 左侧分隔线式样 */
.LeftMenu .line {
  /* width: 60px; */
  width: 230px;
  height: 1px;
  background: rgba(245, 253, 255, 0.5);
  margin: 20px 25px;
  transition: 0.5s;
}

.LeftMenu:hover .line {
  width: 230px;
}

/* 左侧标题栏式样 */
.LeftMenu .title {
  width: 60px;
  margin-left: 25px;
  margin-bottom: 20px;
}

.LeftMenu .title p {
  font-size: 14px;
}

/* 左侧菜单式样 */
.LeftMenu .navAreaLeader {
  width: 230px;
  margin-left: 25px;
}

/* 左菜单 navAreaData 样式 */
.LeftMenu .navAreaData {
  width: 60px;
  max-height: 700px;
  background: rgba(0, 0, 0, 0.5);
  margin-left: 25px;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.5s;
  overflow-y: auto;
}

.LeftMenu .navAreaData::-webkit-scrollbar-thumb {
  color: #00000052;
  background-color: rgba(129, 181, 248, 0.1);
}

.LeftMenu .navAreaData::-webkit-scrollbar {
  color: #00000052;
  background-color: rgba(0, 0, 0, 0.2);
}

.LeftMenu:hover .navAreaData {
  width: 230px;
}

.menuItem .light {
  width: 6px;
  height: 50px;
  background: #eb5a56;
  position: absolute;
  left: -25px;
  transition: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  opacity: 0;
}

.menuItem:hover .light {
  opacity: 1;
}

/* 左侧菜单项-左图标 */
.menuItem .lIcon {
  width: 60px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 左侧菜单项-右图标 */
.menuItem .ricon {
  /* width: 0; */
  width: 60px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  overflow: hidden;
  position: relative;
  /* opacity: 0; */
  opacity: 1;
}

.LeftMenu:hover .ricon {
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}

.ricon .iconFont {
  font-size: 20px;
  color: #62cb44;
}

/* 左侧菜单项-中间文本 */
.context {
  /* width: 0; */
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  overflow: hidden;
  position: relative;
  left: 0px;
  /* opacity: 0; */
  opacity: 1;
  font-weight: 700;
}

.LeftMenu:hover .context {
  width: 160px;
  opacity: 1;
}
</style>
