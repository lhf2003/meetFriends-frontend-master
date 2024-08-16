<template>
  <van-card
      :title="userDetails.userName"
      :desc="userDetails.userProfile"
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
    </template>
  </van-card>

  <van-cell-group>
    <van-cell
        title="年龄"
        :value="userDetails.age"
        icon="age"
    />
    <van-cell
        title="电话"
        :value="userDetails.phone"
        icon="phone"
    />
    <van-cell
        title="邮箱"
        :value="userDetails.email"
        icon="email"
    />
    <van-cell
        title="个人简介"
        :value="userDetails.userProfile"
        icon="info"
    />
  </van-cell-group>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {UserType} from '../models/user';

const route = useRoute();
const userDetails = ref<UserType>({} as UserType);

onMounted(() => {
  const userDetailsQuery = route.query.userDetails as string;
  if (userDetailsQuery) {
    userDetails.value = JSON.parse(userDetailsQuery); // 解析查询参数
  }
});
</script>

<style scoped>
/* 根据需要添加样式 */
</style>
