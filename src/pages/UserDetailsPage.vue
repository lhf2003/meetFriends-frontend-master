<template>
  <!--  <van-card
        :title="userDetails.userName"
        :thumb="userDetails.userAvatar"
    >
      <template #tags>
        <van-tag
            plain
            type="danger"
            v-for="tag in userDetails.tags"
            :key="tag"
            style="margin-right: 8px; margin-top: 8px"
        >
          {{ tag }}
        </van-tag>
        <div class="centered-container">
          <p class="small-text" style="font-weight:bold">
            {{ followCount }} 关注 &nbsp;&nbsp;&nbsp; {{ fanCount }} 粉丝
          </p>
        </div>
      </template>
    </van-card>-->
  <div style="display: flex; flex-direction: column; align-items: center;">
    <van-image
        round
        width="10rem"
        height="10rem"
        :src="currentUser.userAvatar"
        style="box-shadow: 0px 5px 18px rgba(0, 0, 0, 0.7);"
    />
    <p style=" font-weight: bold; margin-top: 0.5rem; text-align: center;">{{ currentUser?.userName }}</p>
  </div>

  <van-cell-group>
    <div class="centered-container">
      <p class="small-text">
        {{ followCount }} 关注 &nbsp;&nbsp;&nbsp; {{ fanCount }} 粉丝
      </p>
    </div>
    <div class="tag-container" v-if="currentUser.tags">
      <van-tag
          v-for="tag in currentUser.tags"
          :key="tag"
          plain
          type="primary"
          size="large"
          class="tag-inline"
      >
        {{ tag }}
      </van-tag>
    </div>
    <van-cell v-if="currentUser.userProfile" title="个人简介" :label="currentUser.userProfile" size="large"/>

    <van-cell
        title="年龄"
        :value="currentUser.age"
    />
    <van-cell
        title="联系电话"
        :value="currentUser.phone"
    />
    <van-cell
        title="邮箱"
        :value="currentUser.email"
    />
    <van-cell
        title="地址"
        :value="currentUser.address"
    />
  </van-cell-group>
  <div v-if="!isFans && (currentUser.id != loginUser.id)" @click="followUser" style="margin: 16px;">
    <van-button round block type="primary" native-type="submit">
      关注
    </van-button>
  </div>
  <div style="margin: 16px;" v-else-if="isFans && (currentUser.id != loginUser.id)" @click="toSendMessage">
    <van-button round block type="primary" native-type="submit">
      发信息
    </van-button>
  </div>
  <div v-if="isFans && (currentUser.id != loginUser.id)" @click="unFollowUser" style="margin: 16px;">
    <van-button round block type="danger" native-type="submit">
      取消关注
    </van-button>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {UserType} from '../models/user';
import myAxios from "../plugins/myAxios";
import {useStore} from "vuex";
import {getCurrentUserState} from "../states/user";
import {Dialog, Toast} from "vant";

const route = useRoute();
const router = useRouter();
const userDetails = ref<UserType>({} as UserType);
const store = useStore();

const followCount = ref(0); // 关注数
const fanCount = ref(0); // 粉丝数
const isFans = ref(false);

// 当前用户信息
const currentUser = reactive(store.state.user);
// 当前登录用户
const loginUser = getCurrentUserState();

onMounted(async () => {
  await getFans();
  await getFollows();
  await isFollow();
});
/**
 * 获取当前用户粉丝数
 */
const getFans = async () => {
  const id = currentUser.id;
  const res = await myAxios.get(`/user/fans/${id}`);
  if (res?.code === 0) {
    fanCount.value = res.data
  } else {
    Toast.fail('获取粉丝数失败' + res?.description)
  }
}
/**
 * 判断是否已关注用户
 */
const isFollow = async () => {
  const id = currentUser.id;
  const res = await myAxios.get(`/user/isfans/${id}`);
  if (res?.code === 0) {
    isFans.value = res.data;
  } else {
    Toast.fail('判断失败' + res?.description)
  }
}

/**
 * 获取当前用户关注数
 */
const getFollows = async () => {
  const id = currentUser.id;
  const res = await myAxios.get(`/user/follows/${id}`);
  if (res?.code === 0) {
    followCount.value = res.data
  } else {
    Toast.fail('获取关注数失败' + res?.description)
  }
}

/**
 * 关注用户
 */
const followUser = async () => {
  Toast.loading({
    message: '操作中...',
    forbidClick: true,
  });
  const id = currentUser.id;
  const res = await myAxios.post(`/user/dofollow/${id}`);
  if (res?.code === 0) {
    isFans.value = true; // 设置状态
    fanCount.value = fanCount.value + 1; // 更新粉丝数显示
    Toast.success('关注成功')
  } else {
    Toast.fail('关注失败' + res?.description)
  }
}

/**
 * 取消关注用户
 */
const unFollowUser = () => {
  Dialog.confirm({
    title: '提示',
    message:
        '确认取消关注该用户吗？',
  })
      .then(async () => { // 确认
        Toast.loading({
          message: '操作中...',
          forbidClick: true,
        });
        const id = currentUser.id;
        const res = await myAxios.post(`/user/unfollow/${id}`);
        if (res?.code === 0) {
          isFans.value = false; // 设置状态
          fanCount.value = fanCount.value - 1; // 更新粉丝数显示
          Toast.success('已取消关注')
        }
      })
      .catch(() => { // 取消
        Toast.success('取消操作')
      });
}

/**
 * 跳转到发送信息页
 */
const toSendMessage = () => {
  store.commit('updateChatUserId', currentUser)
  router.push('/chat/private')
}
</script>

<style scoped>
.tag-container {
  /* 使用 Flexbox 布局 */
  display: flex;
  /* 允许内容换行 */
  flex-wrap: wrap;
  /* 如果需要水平居中，可以添加以下属性 */
  justify-content: center;
  /* 如果需要垂直居中（在容器高度确定的情况下），可以添加以下属性 */
  align-items: center;
}

.tag-inline {
  /* 确保标签之间有一定的间距 */
  margin-right: 5px;
  margin-bottom: 5px;
}

.centered-container {
  display: flex;
  justify-content: center; /* 水平居中 */
}

.small-text {
  font-size: 15px; /* 设置字体大小 */
  /* 可以添加其他样式，如字体颜色、行高等 */
  color: #333;
  line-height: 0;
}
</style>
