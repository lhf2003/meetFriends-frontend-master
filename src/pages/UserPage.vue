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
    <van-cell title="我创建的队伍" is-link to="/user/team/create"/>
    <van-cell title="我加入的队伍" is-link to="/user/team/join"/>
    <van-cell title="关于我们" is-link @click="showPopup"/>
    <van-popup v-model:show="show" :style="{width: '300px', height: '300px', padding: '15px'}">
      MeetFriends是一款服务用户找到适合自己圈子的APP，可以创建或加入队伍发现志同道合的伙伴，也可以通过心动模式匹配与你相似的用户。<br>
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
  user.value = await getCurrentUserState();
  // 处理 tags 字符串
  if (user.value.tags && typeof user.value.tags === 'string') {
    try {
      user.value.tags = JSON.parse(user.value.tags);
    } catch (e) {
      console.error('解析 tags 出错:', e);
    }
  }
});

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
