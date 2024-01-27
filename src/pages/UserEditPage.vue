<template>
  <van-form @submit="onSubmit">
    <div v-if="editUser.editKey ==='gender'" style="margin: 15px">
      <van-field
          v-model="genderDisplay"
          is-link
          readonly
          label="性别"
          placeholder="选择性别"
          @click="showPicker = true"
      />
      <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
            :columns="['男', '女']"
            @cancel="showPicker = false"
            @confirm="onConfirm"
        />
      </van-popup>
    </div>
    <div v-else>
      <van-field
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          :label="editUser.editName"
          :placeholder="`请输入${editUser.editName}`"
      />
    </div>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import { ref, computed } from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

const route = useRoute();
const router = useRouter();
const showPicker = ref(false);


const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
})

const genderDisplay = computed(() => {
  if (editUser.value.editKey === 'gender') {
    if (editUser.value.currentValue === '0') {
      return '男';
    } else if (editUser.value.currentValue === '1') {
      return '女';
    } 
  }
  return editUser.value.currentValue;
});

const onConfirm = (value: string[]) => {
  if (value[0] === '男') {
    editUser.value.currentValue = '男';
  } else if (value[0] === '女') {
    editUser.value.currentValue = '女';
  }
  showPicker.value = false;
};

const onSubmit = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }

  console.log(currentUser, '当前用户')

  let formData = {};
  if (editUser.value.editKey === 'gender') {
    let genderValue = editUser.value.currentValue;
    if (editUser.value.currentValue === '男') {
      genderValue = '0';
    } else if (editUser.value.currentValue === '女') {
      genderValue = '1';
    }
    formData = { ...formData, gender: genderValue };
  } else {
    formData = { ...formData, [editUser.value.editKey as string]: editUser.value.currentValue };
  }

  const res = await myAxios.post('/user/update', {
    'id': currentUser.id,
    ...formData,
  })
  console.log(res, '更新请求');
  if (res.code === 0 && res.data > 0) {
    Toast.success('修改成功');
    router.back();
  } else {
    Toast.fail(res.description);
  }
};

</script>

<style scoped>

</style>
