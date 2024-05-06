<!--
 * @Description: 
 * @Author: liutq
 * @Date: 2024-03-08 20:08:58
 * @LastEditTime: 2024-05-04 20:29:50
 * @LastEditors: liutq
 * @Reference: 
-->
<template>
  <div class="thisBox">
    <div class="displayArea">
      <!-- 头部区域显示部分 -->
      <div class="MessageLeader">
        <leaderHeader :title="userStore.unitData[1].name + '物资领用出入库存管理系统'" />
      </div>
      <!-- 内容列表中间整体部分 -->
      <div class="MessageContent">
        <!-- 内容列表左面部分 -->
        <LeftLeader :addTab="addTab" />
        <!-- 内空列表右面部分 -->
        <div class="RightContent">
          <div style="color: darkgrey">
            <lay-tab
              :type="tabType"
              allow-close
              @close="closeTab"
              v-model="layTableItenCurrent"
            >
              <lay-tab-item
                v-for="a in arrLayTable"
                :key="a.title + a.id"
                :title="a.title"
                :id="a.id"
                :closable="a.closable"
              >
                <div style="color: #171818">
                  <StorageMainPage
                    v-if="a.action == '首页'"
                    :addTab="addTab"
                  ></StorageMainPage>
                  <StorageClassify v-if="a.action == '库存分类'"></StorageClassify>
                  <StorageDataAdmin
                    :addTab="addTab"
                    v-if="a.action == '管理物资'"
                  ></StorageDataAdmin>
                  <UserAuditAdmin v-if="a.action == '援权管理'"></UserAuditAdmin>
                  <StorageInOutAdmin
                    v-if="a.action == '物资详情'"
                    :option="a.option"
                  ></StorageInOutAdmin>
                </div>
              </lay-tab-item>
            </lay-tab>
          </div>
        </div>
      </div>
      <!-- 网页底部部分 -->
      <div class="MessageFooter">
        <leaderFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores";
import leaderHeader from "@/components/leaderHeader.vue";
import leaderFooter from "@/components/leaderFooter.vue";

import LeftLeader from "@/components/StockStorage/LeftLeader.vue";
import StorageMainPage from "@/components/StockStorage/StorageMainPage.vue";
import StorageClassify from "@/components/StockStorage/StorageClassifyAdmin.vue";
import StorageDataAdmin from "@/components/StockStorage/StorageDataAdmin.vue";
import UserAuditAdmin from "@/components/StockStorage/UserAuditAdmin.vue";
import StorageInOutAdmin from "@/components/StockStorage/StorageInOutAdmin.vue";

const userStore = useUserStore();
const layTableItenCurrent = ref("1");
let layTableIndex = 1;

const arrLayTable = ref([
  { id: "1", title: "首页", action: "首页", option: {}, closable: false },
]);

const tabType = ref("brief"); //card\brief\button\
const addTab = function (option: any) {
  //console.log("addTab", option);
  // 判断是否已经存在该选项卡
  let haveItem = arrLayTable.value.find((item) => item.title == option.title);
  if (!haveItem) {
    layTableIndex++;
    arrLayTable.value.push({
      id: String(layTableIndex),
      title: option.title,
      action: option.action,
      option: option.row,
    } as { id: string; title: string; action: string; option: {}; closable: boolean });
    layTableItenCurrent.value = String(layTableIndex);
  } else {
    layTableItenCurrent.value = String(haveItem.id);
  }
};
function closeTab(itemId: any) {
  arrLayTable.value = arrLayTable.value.filter((item) => item.id != itemId);
  layTableItenCurrent.value = String(1);
}

// 表头导航响应式工作变量
let leaderNavData = ref<Array<unitDataType>>([]);
// 定义网页表格数据数组变量【表格】
let unitNavData = ref<Array<unitDataType>>([]);
interface unitDataType {
  id: number;
  areaId: number;
  name: string;
  desc: string;
  city: string;
  lev: number;
}

onMounted(() => {
  // 这里的代码会在组件被挂载到DOM后执行
  // areaNavData = [...userStore.areaData];
  unitNavData.value = [...userStore.unitData];
  leaderNavData.value = [...userStore.unitData];
  //console.log(userStore.unitData);
});
</script>

<style scoped>
/* 外层容器 宽高可视区域100%（100vw,100vh）  */
.thisBox {
  padding: 0px 0px;
  background: url(../assets/images/login_bg.jpg) no-repeat center;
  background-size: cover;
  min-width: 100vw;
  min-height: 100vh;
}

/* 次外层容器 调整内容显示区域*/
.displayArea {
  width: 90%;
  height: 100%;
  min-width: 360px;
  /* max-width: 1500px; */
  border-radius: 0px;
  margin: 0px auto;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.45);
  transition: 0.5s;
}

/* 头部容器窗口 */
.MessageLeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
}

/* 聊天内容容器窗口 */
.MessageContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: calc(100% - 120px);
  padding: 0px 0px;
  margin: 10px 0 5px 0;
}

/* 右侧内容栏式样 */
.MessageContent .RightContent {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0 8px;
  overflow: hidden;
}

/* 头部容器窗口 */
.MessageFooter {
  height: 40px;
  width: 100%;
  bottom: 0px;
}
</style>
