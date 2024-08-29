<template>
  <template v-if="user">
    <van-cell class="cell-container" title="头像" is-link @click="toUpload">
      <van-image
          class="avatar-image"
          height="70px"
          width="70px"
          :src="user.userAvatar"
          :max-size="500 * 1024"
          @oversize="onOversize"
          preview-size="100"
          @click="showFullScreenImage($event)"
      />
    </van-cell>

    <van-cell title="昵称" is-link :value="user.userName"
              @click="toEdit('userName', '昵称', user.userName)"/>
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="标签" is-link :value="user.userTag"
              @click="toEdit('tags', '标签', user.tags)"/>
    <van-cell title="性别" is-link :value="user.gender" @click="toEdit('gender', '性别', user.gender)"/>
    <van-cell title="电话" is-link :value="user.phone" @click="toEdit('phone', '电话', user.phone)"/>
    <van-cell title="邮箱" is-link :value="user.email" @click="toEdit('email', '邮箱', user.email)"/>
    <van-cell title="注册时间" :value="user.createTime"/>

    <van-notify v-model:show="showNotify" type="success">
      <van-icon name="bell" style="margin-right: 4px;"/>
      <span>上传中...</span>
    </van-notify>
    <!-- 弹出层显示全屏图片 -->
    <van-popup v-model:show="showImagePopup" class="fullscreen-popup" position="center">
      <van-image
          :src="user.userAvatar"
          width="100%"
          height="100%"
      />
    </van-popup>

    <!-- 弹出层显示上传头像 -->
    <van-popup v-model:show="showUploadPopup" class="fullscreen-popup" position="center">
      <van-uploader
          :after-read="afterRead"
          :max-count="1"
          :max-size="500 * 1024"
          upload-text="上传头像"
      />
    </van-popup>
  </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {nextTick, onMounted, ref} from "vue";
import moment from "moment";
import {getCurrentUserState, setCurrentUserState} from "../states/user";
import {Toast} from "vant";
import myAxios from "../plugins/myAxios";

const user = ref();
const showImagePopup = ref(false);
const showUploadPopup = ref(false);
const router = useRouter();
const showNotify = ref(false);

onMounted(async () => {
  user.value = await getCurrentUserState();
  console.log(8888888, user.value.userAvatar);
  user.value.createTime = moment(user.value.createTime).format('YYYY-MM-DD');
});

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
    }
  });
};

const toUpload = () => {
  showUploadPopup.value = true;
  nextTick(); // 确保视图更新
};

const onOversize = (file) => {
  console.log(file);
  Toast.fail('文件大小不能超过 500kb');
};

// 点击图片时显示全屏图片
const showFullScreenImage = (event) => {
  event.stopPropagation();  // 阻止事件冒泡
  showImagePopup.value = true;
};

const afterRead = async (file) => {
  showNotify.value = true;
  const uploadFile = new FormData();
  uploadFile.append('uploadFile', file.file);

  // 超时 promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('请求超时'));
    }, 10000);
  });

  // 上传请求 promise
  const uploadPromise = myAxios.post('/obs/upload/avatar', uploadFile, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  try {
    // 使用 Promise.race 来处理超时
    const response = await Promise.race([uploadPromise, timeoutPromise]);

    if (response.code === 0) {  // 根据实际返回的状态码调整
      user.value.userAvatar = response.data.data;  // 更新头像 URL
      console.log(99999, user.value.userAvatar);
      setCurrentUserState(user.value);
      Toast.success('上传成功');
      showUploadPopup.value = false;  // 关闭上传弹窗
    } else {
      Toast.fail(response.data.message || '上传失败');
    }
  } catch (error) {
    if (error.message === '请求超时') {
      // 超时处理逻辑
      Toast.fail('上传超时，请稍后重试');
    } else {
      // 其他错误处理逻辑
      Toast.fail('上传过程中出现错误');
    }
  }
  showNotify.value = false;
};

</script>

<style scoped>
.cell-container {
  display: flex;
  align-items: center; /* 垂直居中对齐内容 */
}

.van-cell__title {
  flex: 1;
  text-align: center; /* 可选：如果需要标题居中显示 */
}

.fullscreen-popup {
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.8); /* 给弹窗设置一个透明背景，确保可以看到它 */
}
</style>
