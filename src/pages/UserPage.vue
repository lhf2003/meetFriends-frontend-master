<template>
  <template v-if="user">
    <div>
      <van-cell-group>
        <van-cell>
          <template #icon>
            <van-image
                width="5rem"
                height="5rem"
                fit="cover"
                position="left"
                :src="user.userAvatar"
                radius="10px"
            />
          </template>
          <template #title>
            <div class="user-name">{{ user.userName }}</div>
            <div class="user-id">ID: {{ user.id }}</div>
            <div class="tags">
              <van-tag
                  class="tags"
                  plain
                  type="danger"
                  v-for="tag in user.tags"
                  :key="tag"
                  style="margin-right: 3px; margin-top: 8px"
              >
                {{ tag }}
              </van-tag>
            </div>
          </template>
          <van-icon name="edit" @click="toUpdate" size="20px"/>
        </van-cell>
      </van-cell-group>
    </div>
    <van-cell title="粉丝列表" is-link to="/user/fans" :value="fansNum"/>
    <van-cell title="关注列表" is-link to="/user/followers" :value="followNum"/>
    <van-cell title="我创建的队伍" is-link to="/user/team/create"/>
    <van-cell title="我加入的队伍" is-link to="/user/team/join"/>
    <van-cell title="关于我们" is-link @click="showPopup"/>
    <van-popup v-model:show="show" :style="{width: '300px', height: '300px', padding: '15px'}">
      在这个快节奏的现代社会中，寻找志同道合的伙伴变得至关重要。MeetFriends 应运而生，致力于为你打造一个专属的社交圈子，让你轻松遇见那些与你心灵契合的朋友。<br>
      详细见：<br>
      如果遇到任何问题请联系：15671389027
    </van-popup>
    <van-cell title="分享给伙伴" @click="showShare = true"/>
    <van-share-sheet
        v-model:show="showShare"
        title="立即分享给好友"
        :options="options"
        @select="onSelect"
    />
    <div>
      <van-button class="logout" type="danger" size="large" @click="toLogout">退出登录</van-button>
    </div>
  </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";
import ast from 'vant';
import {getCurrentUserState, setCurrentUserState} from "../states/user";

const router = useRouter();
const user = ref();
const show = ref(false);
// 粉丝数
const fansNum = ref(0);
// 关注数
const followNum = ref(0);

const showShare = ref(false);
const options = [
  {name: '微信', icon: 'wechat'},
  {name: '微博', icon: 'weibo'},
  {name: '复制链接', icon: 'link'},
  {name: '分享海报', icon: 'poster'},
  {name: '二维码', icon: 'qrcode'},
];

const onSelect = (option) => {
  Toast(option.name);
  showShare.value = false;
};
const toLogout = async () => {
  const res = await myAxios.get('/user/logout')
      .then(response => {
        // 处理成功响应
        if (response.code === 0) {
          setCurrentUserState(null);
          Toast.success('退出登录成功');
          // 跳转到登录页面或其他操作
          router.push('/user/login');
        } else {
          Toast.fail('退出登录失败');
        }
      })
      .catch(error => {
        // 处理错误响应
        Toast.fail('请求出错');
        console.error(error);
      });
}

onMounted(async () => {
  user.value = await getCurrentUser();
  if (user.value) {
    // 处理 tags 字符串
    user.value.tags = user.value.tags || '[]'; // 给 tags 设置默认值
    if (typeof user.value.tags === 'string') {
      try {
        user.value.tags = JSON.parse(user.value.tags);
      } catch (e) {
        console.error('解析 tags 出错:', e);
      }
    }
  } else {
    console.error('用户数据为空');
  }
  await getFollows(); // 获取用户关注数
  await getFans(); // 获取用户粉丝数
});
/**
 * 获取用户关注数量
 */
const getFollows = async () => {
  const id = user.value.id;
  const res = await myAxios.get(`/user/follows/${id}`);
  if (res?.code === 0) {
    followNum.value = res.data;
  } else {
    Toast.fail('获取关注数失败' + res?.description)
  }
}

/**
 * 获取用户粉丝数量
 */
const getFans = async () => {
  const id = user.value.id;
  const res = await myAxios.get(`/user/fans/${id}`);
  if (res?.code === 0) {
    fansNum.value = res.data;
  } else {
    Toast.fail('获取粉丝数失败' + res?.description)
  }
}

const showPopup = () => {
  show.value = true;
};
const toUpdate = () => {
  router.push({
    path: '/user/update'
  })
}
</script>

<style scoped>
.logout {
  /*居中*/
  margin: 20px auto;
}

.user-name {
  margin-left: 10px;
  margin-top: 10px;
  font-size: 25px;
}

.user-id {
  margin-left: 10px;
  margin-top: 17px;
  color: gray;
  font-size: 15px;
}

.tags {
  margin-left: 5px;
}
</style>
