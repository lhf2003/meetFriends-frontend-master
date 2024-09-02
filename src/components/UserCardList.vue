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
        <div v-if="user.distance" class="distance">
          <van-icon name="location-o" size="16px" color="#666" style="margin-right: 4px;"/> <!-- 添加位置图标 -->
          {{ (user.distance / 1000).toFixed(1) }} KM
        </div> <!-- 显示距离 -->
      </template>
      <template #footer>
        <div class="footer-container">
          <van-button type="default" size="small" @click="handleContact(user)">查看</van-button>
        </div>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import {useRouter} from 'vue-router';
import {useStore} from "vuex";

const store = useStore();

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
    store.commit('updateUser', user); // 更新存储的当前用户数据
    // 跳转到用户详情页
    router.push('/user/details')
  } catch (error) {
    console.error('获取用户详情失败:', error);
  }
};
</script>

<style scoped>

.distance {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}
</style>
