<template>
  <van-nav-bar
      :title="title"
      :left-arrow="showLeftArrow"
      :left-text="showLeftText"
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >
    <template #right v-if="showRightButton">
      <van-button class="login-button" v-if="currentUser==null" type="primary" to="/user/login">登录</van-button>
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
    <van-tabbar-item to="/chat" icon="chat-o" name="chat">消息</van-tabbar-item>
    <van-tabbar-item to="/user" icon="user-o" name="user">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router';
import {ref, watch, onMounted} from 'vue';
import routes from '../config/route';
import {Dialog, Toast} from 'vant';
import {getCurrentUserState} from "../states/user";

const router = useRouter();
const route = useRoute();
const DEFAULT_TITLE = 'MeetFriends';
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
  // 需要排除右侧按钮的页面路径
  const noRightButtonPages = ['/user/login'];
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

onMounted(() => {
  // 检查 localStorage 中是否存在访问标志
  const hasVisited = localStorage.getItem('hasVisited');

  // 如果没有访问过，弹出提示框并记录访问状态
  if (!hasVisited) {
    showDialog();
    localStorage.setItem('hasVisited', 'true'); // 设置访问标志
  }
});

const showDialog = () => {
  Dialog.alert({
    title: '温馨提示',
    messageAlign: "left",
    message: `
      <div style="line-height: 1;font-size: 12px">
        欢迎访问 MeetFriends！<br/>
        请仔细阅读以下提示，以获得最佳体验：<br/>
        1. 避免通过外网访问，部分资源可能无法加载<br/>
        2. 手机验证码注册暂不可用，请使用邮箱注册。<br/>
        3. 如果注册遇到问题，可使用测试账号登录：<br/>
           账号：admin 密码：12345678<br/>
        如有任何问题，请联系管理员：<br/>
        <a href="mailto:2385107101@qq.com">2385107101@qq.com</a><br/>
        我们会尽快处理您的反馈并回复您。感谢您的理解！
      </div>
    `,
    allowHtml: true,  // 允许 HTML 内容
  })
};
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
