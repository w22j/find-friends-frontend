<template>
  <template v-if="user">
    <div style="padding-top: 5px"></div>
    <div class="center">
      <van-image class="img"
      round
      width="8rem"
      height="8rem"
      :src="user?.avatarUrl?user.avatarUrl:defaultPicture"
      />
    </div>
    <div style="padding-top: 15px"></div>
    <van-cell title="昵称" :value="user.username" icon ="user-o" />
    <van-cell title="账号" :value="user.userAccount" icon ="manager-o"/>
    <van-cell title="简介" icon ="description">
      <div v-if="user.profile">
        {{ user?.profile }}
      </div>
      <div v-if="!user.profile">
        暂无简介
      </div>
    </van-cell>
    <van-cell title="性别" :value="user.gender === 0 ? '男' :'女'" icon ="friends-o"/>
    <van-cell title="联系方式" :value="user.phone" icon = "comment-o" />
    <van-cell title="邮箱" :value="user.email" icon="envelop-o"/>
  </template>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import { defaultPicture } from "../commons/userCommon";

const user = ref();

const route = useRoute();

onMounted(async () => {
  try {
    const response = await myAxios.get(`/user/${route.params.userId}`);
    user.value = response.data; 
  } catch (error) {
    console.error('Failed to get current user:', error);
  }
});

</script>

<style scoped>

.center {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}
.img {
  margin-top: 20px;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.5);
}
</style>