<template>
  <div style="text-align: center;margin-top: 5px;margin-bottom: 2px">
    <van-uploader :max-size="5000 * 1024"
                  :max-count="1"
                  @oversize="onOversize"
                  :after-read="afterRead">
      <van-image class="img"
          round
          fit ="cover"
          width="7rem"
          height="7rem"
          :src="user?.avatarUrl? user.avatarUrl :defaultPicture "
      />
    </van-uploader>
    <van-divider/>
  </div>
  <template v-if="user">
    <van-cell title="当前用户" :value="user?.username" />
    <van-cell title="修改信息" is-link to="/user/update" />
    <van-cell title="我创建的队伍" is-link to="/user/team/create" />
    <van-cell title="我加入的队伍" is-link to="/user/team/join" />
    <div style="margin-right: 10px; margin-left: 10px;">
    <van-space style="margin: 12px" direction="vertical" fill>
      <van-button round type="danger" @click="logout" block>退出登录</van-button>
    </van-space>
    </div>
    <div class="updateAvatarUrl" v-if="updateAvatarUrl">
      <van-loading color="#0094ff" size="10">头像更新中...</van-loading>
    </div>
  </template>
</template>

<script setup lang="ts">
import {useRouter, useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {defaultPicture} from "../commons/userCommon";
import {Toast, Notify} from "vant";
import {getCurrentUser} from "../services/user";
import { UserType } from "../models/user";

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

const user = ref<UserType>();

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  user.value = await getCurrentUser();
})

const updateAvatarUrl = ref(false)

const afterRead = async (file: any) => {
  const maxSize = 5000 * 1024; // 最大文件大小限制，单位为字节
  if (file.size > maxSize) {
    Toast.fail("头像上传大小不能超过500kb");
    return;
  }

  updateAvatarUrl.value = true
  if (updateAvatarUrl.value) {
    const fileFile = file.file
    const res = await myAxios.post("/file/upload", {
      'file': fileFile,
      'biz': "user_avatar"  
    }, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    const updateavatarUrl = await myAxios.post("/user/update", {
      id: user.value?.id,
      avatarUrl: res.data
    });
    if (updateavatarUrl) {
      user.value = await getCurrentUser()
      Toast.success("更新成功")
      setTimeout(() => {
        updateAvatarUrl.value = false;
      }, 1000);
    }
  }
}
const onOversize = () => {
  Toast.fail("头像上传大小不能超过500kb")
}

const show_avatarUrl_pop = ref("true")

onMounted(async () => {
  const loginUser = await getCurrentUser();
  user.value = loginUser
  if (loginUser) {
    const show_updateavatarUrl = sessionStorage.getItem("avatarUrl")
    show_avatarUrl_pop.value = show_updateavatarUrl ? show_updateavatarUrl : show_avatarUrl_pop.value
    if (show_avatarUrl_pop.value === "true") {
      Notify({message: '点击头像可更换默认头像', type: "primary", duration: 2000});
      show_avatarUrl_pop.value = "false"
      sessionStorage.setItem('avatarUrl', show_avatarUrl_pop.value)
    }
  }
})


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


const logout = async () =>{
 const res = await myAxios.post("/user/logout");
 sessionStorage.clear()
  if(res){
    user.value = null;
    //跳转到之前页面
    const redirectUrl = route.query?.redirect as string ?? '/';
    Toast.success('退出成功');
    window.location.href = redirectUrl;
  }
}
</script>

<style scoped>
.bottom-button {
  width: 160px;
  height: 40px;
}
.updateAvatarUrl {
  position: fixed;
  top: 30%;
  left: 37%;
}
.img {
  margin-top: 20px;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.5);
}
</style>
