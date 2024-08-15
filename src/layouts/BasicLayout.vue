<template>
  <van-nav-bar
      :title="title"
      :left-arrow="showLeftArrow"
      :left-text="showLeftText"
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >
    <template #right v-if="showRightButton">
      <van-button class="login-button" v-if="!currentUser" type="primary" to="/user/login">登录</van-button>
      <van-icon v-else name="search" size="18"/>
    </template>
  </van-nav-bar>
  <van-pull-refresh
      v-model="loading"
      success-text="加载成功"
      @refresh="onRefresh"
  >
    <div id="content">
      <router-view v-if="!loading"/>
    </div>
  </van-pull-refresh>
  <van-tabbar route @change="onChange">
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router';
import {ref, watch, onMounted} from 'vue';
import routes from '../config/route';
import {Toast} from 'vant';
import {getCurrentUserState} from "../states/user";
import myAxios from "../plugins/myAxios";

const router = useRouter();
const route = useRoute();
const DEFAULT_TITLE = '伙伴匹配';
const title = ref(DEFAULT_TITLE);
const loading = ref(false);
let currentUser = ref(getCurrentUserState());
const showRightButton = ref(true);
const showLeftText = ref("返回");
const showLeftArrow = ref(true);

const onRefresh = () => {
  loading.value = true;
  // 模拟异步操作，例如网络请求
  setTimeout(() => {
    currentUser.value = getCurrentUserState();
    Toast.success('加载成功');
    loading.value = false;
  }, 1000); // 假设请求耗时 1 秒
};

router.beforeEach((to, from, next) => {
  const toPath = to.path;
  const route = routes.find((route) => toPath === route.path);
  title.value = route?.title ?? DEFAULT_TITLE;
  currentUser.value = getCurrentUserState();
  // 设置页面左侧箭头
  // 如果当前页面是"/",showLeftArrows设为false，showLeftText设为空
  if (toPath === '/') {
    showLeftArrow.value = false;
    showLeftText.value = '';
  } else {
    showLeftArrow.value = true;
    showLeftText.value = '返回';
  }
  // 设置哪些页面需要显示右侧按钮
  const noRightButtonPages = ['/user/login']; // 需要排除右侧按钮的页面路径
  showRightButton.value = !noRightButtonPages.includes(toPath);
  next();
});

const onClickLeft = () => {
  router.back();
};

const onClickRight = () => {
  if (currentUser.value) {
    router.push('/search');
  } else {
    router.push('/user/login');
  }
};
const onChange = (event) => {
  // 处理 tabbar 变化时的逻辑
  console.log('Tabbar changed to:', event);
};

// 监听路由变化并触发页面组件的刷新方法
watch(route, () => {
  loading.value = true;
  setTimeout(() => {
    currentUser.value = getCurrentUserState();
    loading.value = false;
  }, 1000);
});
</script>

<style scoped>
#content {
  padding-bottom: 50px;
}

.login-button {
  width: 54px;
  height: 30px;
  background-color: #1989fa;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 12px;
}
</style>
