<template>
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="user in props.userList">
    <van-card class="card"
        :desc="user.profile?'简介：'+ user.profile:'简介：该用户比较懒,暂时没有设置'"
        :title="`${user.username}`"
        :thumb="user?.avatarUrl? user.avatarUrl :defaultPicture"
    >
      <template #tags>
        <div v-if="user.tags.length<7" style="margin-bottom: 12px"></div>
        标签：<br>
        <van-tag plain type="danger" v-for="tag in user.tags" style="margin-right: 8px; margin-top: 8px">
          {{ tag }}
        </van-tag>
        <span v-if="!user.tags||user.tags.length<=0">该用户未设置标签</span>
      </template>
      <template #footer>
        <van-button size="mini"  @click="showUser(user.id)">查看</van-button>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import { defaultPicture } from "../commons/userCommon";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

interface UserCardListProps {
  loading: boolean;
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,
  // @ts-ignore
  userList: [] as UserType[],
});

const showUser = (id: number) => {
  router.push({
    name: 'userShow',
    params: {
      userId: id
    }
  })
}


</script>

<style scoped>
.card :deep(.van-card__title) {
    font-size: 13px;
    font-weight: bold;
}
</style>
