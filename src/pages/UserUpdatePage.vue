<template>
  <template v-if="user">
    <van-cell title="昵称" is-link to="/user/edit" :value="user.username" icon ="user-o"  @click="toEdit('username', '昵称', user.username)"/>
    <van-cell title="账号" :value="user.userAccount" icon ="manager-o"/>
    <van-cell title="头像" icon ="user-circle-o" >
      <img style="height: 48px" :src="user.avatarUrl"/>
    </van-cell>
    <van-cell title="个人简介" is-link to="/user/edit" :value="user.profile" icon ="description" @click="toEdit('profile','个人介绍',user.profile)"/>
    <van-cell value="点击查看" is-link icon ="label-o" 
              @click="tagUpdate(user.tags,user.id,'tags')">
      <template #title>
        <span class="custom-title">个人标签</span>
      </template>
    </van-cell>
    <van-cell title="性别" is-link to="/user/edit" :value="user.gender === 0 ? '男' :'女'" icon ="friends-o" @click="toEdit('gender','性别',user.gender)"/>
    <van-cell title="联系方式" is-link to="/user/edit" :value="user.phone" icon = "comment-o" @click="toEdit('phone', '电话', user.phone)"/>
    <van-cell title="邮箱" is-link to="/user/edit" :value="user.email" icon="envelop-o" @click="toEdit('email', '邮箱', user.email)"/>
    <van-cell title="注册时间" :value="user.createTime" icon="clock-o"/>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";

// const user = {
//   id: 1,
//   username: '鱼皮',
//   userAccount: 'dogYupi',
//   avatarUrl: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/logo.png',
//   gender: '男',
//   phone: '123112312',
//   email: '12345@qq.com',
//   planetCode: '1234',
//   createTime: new Date(),
// }
const user = ref();

onMounted(async () => {
  user.value = await getCurrentUser();
})

const router = useRouter();

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

const tagUpdate = (tags: string, id: number) => {
  router.push({
    path: "/search",
    query: {
      id: id,
      tags: JSON.parse(tags),
    }
  })
}
</script>

<style scoped>

</style>