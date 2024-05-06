

/**
 * * article模块接口列表
 */

import base from './baseUrl'; // 导入接口域名列表
import Axios from './apiInstance'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const article = {
    // 获取文章列表
    articleList (params) {
        return Axios.get(`${base.sq}/article/list`, { params: params });
    },  
    // 获取文章详情
    articleDetail (params) {
        return Axios.get(`${base.sq}/article/detail`, { params: params });
    },
    // post提交
    login (params) {
        
        return Axios.post(`${base.sq}/login`, qs.stringify(params));
    },

    

}



// 断网的处理
{/* <div v-if="!network">
<h3>我没网了</h3>
<div @click="onRefresh">刷新</div>
</div> */}

// onRefresh () { this.$router.replace('/refresh') }

// refresh.vue，beforeRouteEnter钩子中再返回当前页面
// beforeRouteEnter (to, from, next) {
//     next(vm => {
//         vm.$router.replace(from.fullPath)
//     })
// }


export default article;
