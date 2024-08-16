<template>
  <template v-if="user">
    <van-cell title="昵称" is-link to="/user/edit" :value="user.userName"
              @click="toEdit('userName', '昵称', user.userName)"/>
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="头像" is-link to="/user/edit">
      <img style="height: 48px" :src="user.userAvatar"/>
    </van-cell>
    <van-cell title="标签" is-link to="/user/edit" :value="user.userTag"
              @click="toEdit('tags', '标签', user.tags)"/>
    <van-cell title="性别" is-link :value="user.gender" @click="toEdit('gender', '性别', user.gender)"/>
    <van-cell title="电话" is-link to="/user/edit" :value="user.phone" @click="toEdit('phone', '电话', user.phone)"/>
    <van-cell title="邮箱" is-link to="/user/edit" :value="user.email" @click="toEdit('email', '邮箱', user.email)"/>
    <van-cell title="注册时间" :value="formattedCreateTime"/>
  </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";
import moment from "moment";

const user = ref();

onMounted(async () => {
  user.value = await getCurrentUser();
})

const router = useRouter();
const formattedCreateTime = ref('');

// 在组件挂载时格式化时间
onMounted(() => {
  formattedCreateTime.value = moment(user.createTime).format('YYYY-MM-DD');
});
const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
    }
  })
}
</script>

<style scoped>

</style>