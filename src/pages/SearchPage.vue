<template>
  <form action="/">
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入要搜索的账号或标签"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
  <van-divider content-position="left">已选标签</van-divider>
  <div v-if="activeIds.length === 0" style="margin-left: 15px; color: gray; font-size: 14px;">还未选择标签</div>
  <van-row gutter="16" style="padding: 0 16px">
    <van-col v-for="tag in activeIds">
      <van-tag closeable size="small" type="primary" @close="doClose(tag)">
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>
  <van-divider content-position="left">选择标签</van-divider>
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />
  <div style="padding: 12px">
    <van-button block type="primary" @click="doSearchResult">搜索</van-button>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from "vue-router";

const router = useRouter()

const searchText = ref('');

const originTagList = [{
  text: '编程语言',
  children: [
    {text: 'Java', id: 'Java'},
    {text: 'Python', id: 'Python'},
    {text: 'C/C++', id: 'C/C++'},
    {text: 'JavaScript', id: 'JavaScript'},
    {text: 'Go', id: 'Go'},
    {text: 'TypeScript', id: 'TypeScript'},
    {text: 'PHP', id: 'PHP'},
  ],
},
  {
    text: '身份',
    children: [
      {text: '大一', id: '大一'},
      {text: '大二', id: '大二'},
      {text: '大三', id: '大三'},
      {text: '研究生', id: '研究生'},
      {text: '博士', id: '博士'},
    ],
  },
  {
    text: '状况',
    children: [
      {text: '在校', id: '在校'},
      {text: '实习', id: '实习'},
      {text: '求职', id: '求职'},
      {text: '自学', id: '自学'},
      {text: '已毕业', id: '已毕业'},
      {text: '家里蹲', id: '家里蹲'},
    ],
  },
]

// 标签列表
let tagList = ref(originTagList);

/**
 * 搜索过滤
 * @param val
 */
const onSearch = (val) => {
  tagList.value = originTagList.map(parentTag => {
    const tempChildren = [...parentTag.children];
    const tempParentTag = {...parentTag};
    tempParentTag.children = tempChildren.filter(item => item.text.includes(searchText.value));
    return tempParentTag;
  });

}
const onCancel = () => {
  searchText.value = '';
  tagList.value = originTagList;
};

// 已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);

// 移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter(item => {
    return item !== tag;
  })
}

/**
 * 执行搜索
 */
const doSearchResult = () => {
  if (activeIds.value.length === 0) {
    router.push({
      path: '/user/list',
      query: {
        userName: searchText.value
      }
    })
  } else {
    router.push({
      path: '/user/list',
      query: {
        tags: activeIds.value
      }
    })
  }
}

</script>

<style scoped>

</style>
