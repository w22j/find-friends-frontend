<template>
  <div>
  <div class="center">
  <van-image class="img"
  round
  width="8rem"
  height="8rem"
  :src="defaultPicture"
/>
</div>
    <div style="padding-top: 20px"></div>
    <van-row justify="center">
      <h3>"寻知己 —— 寻找志趣相投的伙伴"</h3>
    </van-row>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="username"
          name="昵称"
          label="昵称"
          placeholder="昵称"
          :rules="[{ required: true, message: '请输入昵称' }]"
      />
      <van-field
          v-model="userAccount"
          name="账号"
          label="账号"
          placeholder="账号"
          :rules="[{ required: true, message: '请输入账号' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请输入密码' }]"
      />
      <van-field
          v-model="checkPassword"
          type="password"
          name="确认密码"
          label="确认密码"
          placeholder="确认密码"
          :rules="[{ required: true ,validator, message: '请重新输入密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        注册
      </van-button>
    </div>
    <van-cell title="" to="/user/login" value="已有账号？点击登录"></van-cell>
  </van-form>
  <copyright/>
</div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {defaultPicture} from "../commons/userCommon";
import Copyright from "../components/CopyRight.vue";

const username = ref('');
const userAccount = ref('');
const userPassword = ref('');
const checkPassword = ref('');
const router = useRouter();
const route = useRoute();



const onSubmit = async () => {
  const res = await myAxios.post("/user/register", {
    username: username.value,
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
  })
  if (res.code === 0 && res.data) {
    //跳转到之前页面
    const redirectUrl = route.query?.redirect as string ?? '/';
    Toast.success('注册成功');
    window.location.href = redirectUrl;
  } else {
    Toast.fail('注册失败 '+res.description);
  }
};
const validator = (val : string) =>{
  if (val === userPassword.value){
    return true;
  }
  return false;
}
</script>

<style scoped>
.center {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}
.img {
    margin-top: 50px;
    box-shadow: 0 0 14px rgba(0, 0, 0, 0.5);
}

div#copyright {
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: #999;
  background-color: #fff;
  position: sticky;
  bottom: 0;
  z-index: 999;
}

  a,a:link,a:visited,a:hover,a:active{
    text-decoration: none;
    color:inherit;
  }

</style>