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
          <div class="context">{{ data.listName }}</div>
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
import { onMounted, reactive, ref } from "vue";
const addTab = defineProps(["addTab"]);
const AreaLeaderT = ref(true);
const mainMenu = ref<Array<mainMenuType>>([
  {
    id: 1,
    title: "首页",
    action: "首页",
    listName: "首页",
    desc: "首页",
  },
  {
    id: 2,
    title: "库存分类",
    action: "库存分类",
    listName: "管理库存分类目录",
    desc: "管理库存分类目录",
  },
  {
    id: 3,
    title: "管理物资",
    action: "管理物资",
    listName: "管理库存物资目录",
    desc: "管理库存物资目录信息",
  },
  {
    id: 4,
    title: "援权管理",
    action: "援权管理",
    listName: "分配数据审核权限",
    desc: "给用户分配管理角色和权限",
  },
]);
interface mainMenuType {
  id: number;
  title: string;
  action: string;
  listName: string;
  desc: string;
}

onMounted(() => {});

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
    title: mainMenu.value[sn].title,
    action: mainMenu.value[sn].action,
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
