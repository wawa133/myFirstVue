<template>
  <div class="thisBox">
    <div class="displayArea">
      <!-- 头部区域显示部分 -->
      <div class="MessageLeader">
        <leaderHeader />
      </div>
      <!-- 内容列表中间整体部分 -->
      <div class="MessageContent">
        <!-- 内容列表左面部分 -->
        <bodyLeftLeader />
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
                  <userInformation v-if="a.id == '1'" :addTab="addTab"></userInformation>
                  <!-- <projectCacheAuthorize
                    v-if="a.title == '授权管理'"
                    :prompt="a.option"
                  ></projectCacheAuthorize> -->
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
import { ref } from "vue";
import leaderHeader from "@/components/leaderHeader.vue";
import leaderFooter from "@/components/leaderFooter.vue";
import bodyLeftLeader from "@/components/bodyLeftLeader.vue";
import userInformation from "@/components/userInformation/userInformation.vue";

// 页面卡片部分--------------------------------------------
const layTableItenCurrent = ref("1");
let layTableIndex = 1;
const arrLayTable = ref([
  { id: "1", title: "通迅录", option: {}, closable: false },
  // { id: "2", title: "权限管理" },
  // { id: "3", title: "支付管理" },
]);
const tabType = ref("brief"); //card\brief\button\
const addTab = function (option: any) {
  let haveItem = arrLayTable.value.find((item) => item.title == option.action);
  if (!haveItem) {
    layTableIndex++;
    arrLayTable.value.push({
      id: String(layTableIndex),
      title: option.action,
      option: option,
    } as { id: string; title: string; option: {}; closable: boolean });
    layTableItenCurrent.value = String(layTableIndex);
  } else {
    layTableItenCurrent.value = String(haveItem.id);
  }
};
function closeTab(itemId: any) {
  arrLayTable.value = arrLayTable.value.filter((item) => item.id != itemId);
  layTableItenCurrent.value = String(1);
}
// 页面卡片部分--------------------------------------------
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
  max-width: 1700px;
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
