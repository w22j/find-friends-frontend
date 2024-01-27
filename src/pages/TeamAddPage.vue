<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <div class="center">
      <van-uploader :after-read="afterRead"
                    :max-count="1"
                    :max-size="5000 * 1024"
                    @oversize="onOversize">
        <van-image class="img"
          round
          fit ="cover"
          width="8rem"
          height="8rem"
          :src="addTeamData?.avatarUrl? addTeamData.avatarUrl :defaultPicture "
      />
      </van-uploader>
    </div>
    <van-divider>队伍头像</van-divider>
      <van-cell-group inset>
        <van-field
            v-model="addTeamData.name"
            name="name"
            label="队伍名"
            placeholder="请输入队伍名"
            :rules="[{ required: true, message: '请输入队伍名' }]"
        />
        <van-field
            v-model="addTeamData.description"
            rows="4"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
        <van-field
            is-link
            readonly
            name="datetimePicker"
            label="过期时间"
            :placeholder="addTeamData.expireTime ?? '点击选择过期时间'"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-datetime-picker
              v-model="addTeamData.expireTime"
              @confirm="showPicker = false"
              type="datetime"
              title="请选择过期时间"
              :min-date="minDate"
          />
        </van-popup>
        <van-field name="stepper" label="最大人数">
          <template #input>
            <van-stepper v-model="addTeamData.maxNum" max="10" min="3"/>
          </template>
        </van-field>
        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
            v-if="Number(addTeamData.status) === 2"
            v-model="addTeamData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入队伍密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
    <div class="updateAvatarUrl" v-if="updateAvatarUrl">
    <van-loading color="#0094ff" size="10">头像更新中...</van-loading>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import {ref, onMounted} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast, Notify} from "vant";
import {defaultPicture} from "../commons/userCommon";

const router = useRouter();
// 展示日期选择器
const showPicker = ref(false);

const updateAvatarUrl = ref(false)

const initFormData = {
  "name": "",
  "avatarUrl": "",
  "description": "",
  "expireTime": null,
  "maxNum": 3,
  "password": "",
  "status": 0,
}

const minDate = new Date();

const afterRead = async (file: any) => {
    updateAvatarUrl.value = true
  if(updateAvatarUrl.value){
    const res = await myAxios.post("/file/upload", {
      'file': file.file,
      'biz': "team_avatar"
    }, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    if (res?.code === 0 && res.data) {
      addTeamData.value.avatarUrl = res.data;
    } else {
      Toast.fail("上传失败");
    }
    if (res.data)
    setTimeout(() => {
      updateAvatarUrl.value = false
    }, 1300);
  }
};

const onOversize = () => {
  Toast.fail("头像上传大小不能超过500kb")
}

const show_TeamAvatarUrl_pop = ref("true")

onMounted(() => {
  const show_teamCreateAvatarUrl = sessionStorage.getItem("teamCreateAvatarUrl")
  show_TeamAvatarUrl_pop.value = show_teamCreateAvatarUrl ? show_teamCreateAvatarUrl : show_TeamAvatarUrl_pop.value
  if (show_TeamAvatarUrl_pop.value === "true") {
    Notify({message: '点击默认头像可更换队伍头像', type: "primary", duration: 2000});
    show_TeamAvatarUrl_pop.value = "false"
    sessionStorage.setItem('teamCreateAvatarUrl', show_TeamAvatarUrl_pop.value)
  }
})

// 需要用户填写的表单数据
const addTeamData = ref({...initFormData})

// 提交
const onSubmit = async () => {
  const postData = {
    ...addTeamData.value,
    avatarUrl: String(addTeamData.value.avatarUrl),
    status: Number(addTeamData.value.status),
    // 后端需要 yyyy-mm-dd 格式Date，需要强转，date月份是从0开始设置的需要减一
    expireTime: formatDateTime(addTeamData.value.expireTime),
  }
  // todo 前端参数校验
  const res = await myAxios.post("/team/add", postData);
  if (res?.code === 0 && res.data){
    Toast.success('添加成功');
    router.push({
      path: '/team',
      replace: true,
    });
  } else {
    Toast.success('添加失败');
  }
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
</script>

<style scoped>
#teamPage {

}
.center {
    margin-top: 10px;
    display: flex;
    justify-content: center;
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
