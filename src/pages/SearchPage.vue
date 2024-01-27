<template>
  <form action="/">
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入要搜索的标签"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
  <van-divider content-position="left">已选标签</van-divider>
  <div v-if="activeIds.length === 0">请选择标签</div>
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
  <van-divider/>
  <van-space direction="vertical" fill>
    <van-button v-if="userId" block type="primary" @click="updateTag">修改
    </van-button>
    <van-button block v-else type="primary" @click="doSearchResult">搜索</van-button>
  </van-space>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {Toast} from "vant";
import {useRouter, useRoute} from "vue-router";
import myAxios from "../plugins/myAxios";
import { getCurrentUser } from "../services/user";

const router = useRouter()
const route = useRoute()

const searchText = ref('');
const userId = ref();
const userTags = ref([]);

const originTagList = [{
  text: '性别',
  children: [
    {text: '男', id: '男'},
    {text: '女', id: '女'},
  ],
},
  {
    text: '年级',
    children: [
      {text: '高一', id: '高一'},
      {text: '高二', id: '高二'},
      {text: '高三', id: '高三'},
      {text: '大一', id: '大一'},
      {text: '大二', id: '大二'},
      {text: '大三', id: '大三'},
      {text: '大四', id: '大四'},
    ],
  }, 
  {
        text: '运动',
        children: [
            {text: '羽毛球', id: '羽毛球'},
            {text: '乒乓球', id: '乒乓球'},
            {text: '排球', id: '排球'},
            {text: '网球', id: '网球'},
            {text: '桌球', id: '桌球'},
            {text: '滑雪', id: '滑雪'},
            {text: '潜水', id: '潜水'},
            {text: '篮球', id: '篮球'},
        ],
    },
    {
        text: '状态',
        children: [
            {text: '求职中', id: '求职中'},
            {text: '学习中', id: '学习中'},
            {text: '上班族', id: '上班族'},
            {text: '找伙伴', id: '找伙伴'},
        ],
    }, {
        text: '学习方向',
        children: [
            {text: 'Java', id: 'Java'},
            {text: 'C', id: 'C'},
            {text: 'C++', id: 'C++'},
            {text: 'go', id: 'go'},
            {text: 'C#', id: 'C#'},
            {text: 'python', id: 'python'},
            {text: 'php', id: 'php'},
            {text: '网络安全', id: '网络安全'},
            {text: '运维', id: '运维'},
            {text: '架构师', id: '架构师'},
            {text: 'Vue', id: 'Vue'},
        ],
    }, {
        text: '兴趣爱好',
        children: [
            {text: '音乐', id: '音乐'},
            {text: '运动', id: '运动'},
            {text: '旅游', id: '旅游'},
            {text: '美食', id: '美食'},
            {text: '电影', id: '电影'},
            {text: '读书', id: '读书'},
            {text: '摄影', id: '摄影'},
            {text: '游戏', id: '游戏'},
            {text: '手工', id: '手工'},
            {text: '绘画', id: '绘画'},
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
  activeIds.value = [];
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
  router.push({
    path: '/user/list',
    query: {
      tags: activeIds.value
    }
  })
}

const updateTag = async () => {
  const update = await myAxios.post("/user/update/tags", {
    id: userId.value,
    tagList: activeIds.value
  })
  if (update && update.data === true) {
    await router.push("/user/update")
  }
}
onMounted(() => {
  const {id, tags} = route.query
  if (id && tags) {
    userId.value = id;
    userTags.value = tags
    activeIds.value = tags
  }
  getCurrentUser()
})
watch(activeIds, (newList) => {
  if (newList.length > 12) {
    Toast.fail("最多只能选择12个标签")
    activeIds.value = activeIds.value.slice(0, 12)
  }
});

</script>

<style scoped>

</style>
