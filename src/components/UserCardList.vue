<template>
  <van-skeleton
      title
      avatar
      :row="3"
      :loading="props.loading"
      v-for="user in props.userList"
      :key="user.id"
  >
    <van-card
        :desc="user.userProfile"
        :title="`${user.userName}`"
        :thumb="user.userAvatar"
    >
      <template #tags>
        <van-tag
            plain
            type="danger"
            v-for="tag in user.tags"
            :key="tag"
            style="margin-right: 8px; margin-top: 8px"
        >
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <div v-if="user.distance"> 距离: {{ (user.distance / 1000).toFixed(1) }} 千米</div> <!-- 显示距离 -->
        <van-button type="default" size="mini" @click="handleContact(user)">联系我</van-button>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import {useRouter} from 'vue-router';

interface UserCardListProps {
  loading: boolean;
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,
  userList: [] as UserType[],
});

const router = useRouter();

const handleContact = async (user: UserType) => {
  try {
    // 跳转到用户详情页
    router.push({
      path: '/user/details',
      query: {
        userDetails: JSON.stringify(user) // 确保将对象字符串化传递
      }
    });
  } catch (error) {
    console.error('获取用户详情失败:', error);
  }
};
</script>

<style scoped>
</style>
