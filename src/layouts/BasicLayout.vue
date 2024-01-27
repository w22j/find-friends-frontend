<template>
  <van-nav-bar
  v-if="!NOT_SHOW_NAVBAR_AND_TABBAR.includes(route.path)" left-arrow left-text="返回"
  :title="title"
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <div id="content">
    <router-view/>
  </div>
  <van-tabbar route placeholder v-if="!NOT_SHOW_NAVBAR_AND_TABBAR.includes(route.path)">
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import {ref} from "vue";
import routes from "../config/route";
import Copyright from "../components/CopyRight.vue";


const NOT_SHOW_NAVBAR_AND_TABBAR = ["/user/login", '/user/register']; 
const router = useRouter();
const route = useRoute();
const DEFAULT_TITLE = '伙伴匹配';
const title = ref(DEFAULT_TITLE);

/**
 * 根据路由切换标题
 */
router.beforeEach((to, from) => {
  const toPath = to.path;
  const route = routes.find((route) => {
    return toPath == route.path;
  })
  title.value = route?.title ?? DEFAULT_TITLE;
})

const onClickLeft = () => {
  router.back();
};

const onClickRight = () => {
  router.push('/search')
};

</script>

<style scoped>
#content {
  padding-bottom: 50px;
}

div#copyright {
    width: 100%;
    text-align: center;
    font-size: 13px;
    color: #999;
    background-color: #fff;
  }

  a,a:link,a:visited,a:hover,a:active{
    text-decoration: none;
    color:inherit;
  }
  
</style>
