<template>
  <div id="teamPage">
    <div class="top-bar">
      <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch" class="search-box"/>
      <van-button class="add" icon="plus" type="primary" size="small" @click="toAddTeam">添加队伍</van-button>
      <!--      <van-button square class="add-button" type="primary" icon="plus" @click="toAddTeam">添加队伍</van-button>-->
    </div>
    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public"/>
      <van-tab title="加密" name="private"/>
    </van-tabs>
    <div style="margin-bottom: 15px"/>
    <team-card-list :teamList="teamList"/>
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>
    <van-pagination v-if="teamList?.length >=1" v-model="currentPage" :total-items="100" :items-per-page="itemsPerPage"
                    :show-page-size="3" force-ellipses @change="onPageChange"/>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref, watch} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const active = ref('public')
const router = useRouter();
const searchText = ref('');

const currentPage = ref(1);
const itemsPerPage = ref(3);

const onPageChange = (page: number) => {
  currentPage.value = page;
}
/**
 * 切换查询状态
 * @param name
 */
const onTabChange = (name) => {
  // 查公开
  if (name === 'public') {
    currentPage.value = 1; // 重置页码为1
    listTeam(searchText.value, 0);
  } else {
    // 查加密
    currentPage.value = 1; // 重置页码为1
    listTeam(searchText.value, 2);
  }
}

// 跳转到创建队伍页
const toAddTeam = () => {
  router.push({
    path: "/team/add"
  })
}

const teamList = ref([]);

/**
 * 搜索队伍
 * @param val
 * @param status
 * @returns {Promise<void>}
 */
const listTeam = async (val = '', status = 0) => {
  const res = await myAxios.get("/team/list", {
    params: {
      searchText: val,
      pageNum: currentPage.value,
      pageSize: itemsPerPage.value,
      status,
    },
  });
  if (res?.code === 0) {
    teamList.value = res.data;
  } else if (res?.code === 40004) {
    Toast.fail('数据为空');
  } else {
    Toast.fail('失败，请刷新重试');
  }
}

// 页面加载时只触发一次
onMounted(() => {
  listTeam();
})

const onSearch = (val) => {
  listTeam(val);
};
// 监听页码变化
watch(currentPage, () => {
  listTeam();
});
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  flex-grow: 1;
}

.add {
  margin-right: 5px;
}
</style>

