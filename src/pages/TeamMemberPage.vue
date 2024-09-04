<!-- 队伍成员列表页 -->
<template>
  <!-- 用户卡片列表 -->
  <user-card-list :user-list="memberList" :loading="loading"/>
  <van-divider/>
  <!-- 未加载到数据 -->
  <van-empty v-if="!memberList || memberList.length < 1" description="数据为空"/>

</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import UserCardList from "../components/UserCardList.vue";
import {useStore} from "vuex";
import {Toast} from "vant";
import myAxios from "../plugins/myAxios";

const memberList = ref([]); // 用户集合
const loading = ref(true);
const store = useStore();
const teamId = reactive(store.state.team.id);

const loadData = () => {
  listTeamMembers();
}

/**
 * 获取队伍成员
 */
const listTeamMembers = async () => {
  const res = await myAxios.get('/team/members', {
    params: {
      teamId: teamId
    }
  });
  if (res?.code === 0) {
    res.data.forEach(member => {
      if (member.tags) { // 解析后端返回的json字符串
        member.tags = JSON.parse(member.tags);
      }
    })
    memberList.value = res.data;
  } else {
    Toast.fail('加载失败!' + res?.description);
  }
  loading.value = false;
}

onMounted(() => {
  loadData();
})

</script>

<style scoped>
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>