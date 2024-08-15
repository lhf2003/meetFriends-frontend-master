<template>
  <user-card-list :user-list="userList"/>
  <van-empty v-if="!userList || userList.length < 1" description="搜索结果为空"/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import myAxios from '../plugins/myAxios';
import { Toast } from 'vant';
import qs from 'qs';
import UserCardList from '../components/UserCardList.vue';

const route = useRoute();
const { tags } = route.query;

const userList = ref([]);
let toastId = null;

onMounted(async () => {
  // 显示加载中提示
  toastId = Toast.loading('加载中...', { duration: 0 });

  try {
    const response = await myAxios.get('/user/search/tags', {
      params: {
        tagNameList: tags
      },
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      }
    });

    console.log('/user/search/tags succeed', response);
    const userListData = response?.data || [];

    // 处理用户数据
    userListData.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    });
    userList.value = userListData;
  } catch (error) {
    console.error('/user/search/tags error', error);
    Toast.fail('请求失败');
  } finally {
    // 隐藏加载中提示
    if (toastId) {
      Toast.clear(toastId);
    }
  }
});
</script>

<style scoped>
</style>
