<!-- 搜索结果页 -->
<template>
  <van-empty v-if="!userList || userList.length < 1" description="搜索结果为空"/>
  <div v-else>
    <!-- 用户卡片列表 -->
    <user-card-list :user-list="userList" :loading="loading"/>
  </div>

</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRoute} from "vue-router";
import myAxios from '../plugins/myAxios.ts';
import qs from 'qs';
import UserCardList from "../components/UserCardList.vue";

const route = useRoute(); // 获取查询参数
const userList = ref([]); // 用户集合
const loading = ref(true); // 骨架屏加载效果
const query = route.query;

// 组件加载完成后查找标签符合的用户
onMounted(async () => {
  const response = ref();
  if (query.userName) {
    response.value = await myAxios.get('/user/search', {
      params: {
        userName: query.userName
      },
    });
  } else {
    response.value = await myAxios.get('/user/search/tags', {
      params: {
        tagNameList: query.tags
      },
      // 解析参数使得后端集合能够接收到
      paramsSerializer: params => qs.stringify(params, {indices: false})
    });
  }
  let userListData = response.value?.data || [];

// 通过昵称查询结果不是数组，将其转换为数组
  if (!Array.isArray(userListData)) {
    userListData = [userListData];
  }

// 处理用户数据
  userListData.forEach(user => {
    if (user.tags) {
      try {
        user.tags = JSON.parse(user.tags);
      } catch (e) {
        console.error("Failed to parse tags:", e);
      }
    }
  });
  userList.value = userListData;
  loading.value = false;
});
</script>

<style scoped>

</style>