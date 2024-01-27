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
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary"  native-type="submit">
        登录
      </van-button>
      <van-divider/>
      <van-button round block type="default" plain to="/user/register">
        注册新用户
      </van-button>
    </div>
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
import Copyright from "../components/Copyright.vue";

const userAccount = ref('');
const userPassword = ref('');
const router = useRouter();
const route = useRoute();
const onSubmit = async () => {
  const res = await myAxios.post("/user/login", {
    userAccount: userAccount.value,
    userPassword: userPassword.value
  })
  console.log(res, "登录返回信息");
  if (res.code === 0 && res.data) {
    //跳转到之前页面
    const redirectUrl = route.query?.redirect as string ?? '/';
    Toast.success('登陆成功');
    window.location.href = redirectUrl;
  } else {
    Toast.fail('登录失败'+res.description);
  }
};
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