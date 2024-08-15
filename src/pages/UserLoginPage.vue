<template>
  <div class="form-container">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="userAccount"
            name="userAccount"
            label="账号"
            placeholder="请输入账号"
            required
            :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
            v-model="userPassword"
            type="password"
            name="userPassword"
            label="密码"
            placeholder="请输入密码"
            required
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div class="button-container">
        <van-button round block :loading="isLoading" type="primary" native-type="submit">
          登录
        </van-button>
      </div>
      <div class="register-link">
        <van-button class="register-button" type="link" @click="showRegisterDialog">没有账号？注册</van-button>
      </div>
    </van-form>
  </div>

  <van-dialog v-model:show="showRegister" title="注册" show-cancel-button @confirm="onConfirmRegister">
    <van-form @submit.prevent="onConfirmRegister">
      <van-field v-model="newUserAccount" name="newUsername" label="用户名" placeholder="请输入用户名" required/>
      <van-field v-model="newPassword" name="newPassword" label="密码" type="password" placeholder="请输入密码"
                 required/>
      <van-field v-model="checkPassword" name="checkPassword" label="确认密码" type="password"
                 placeholder="请再次输入密码" required/>
    </van-form>
  </van-dialog>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {ref} from 'vue';
import myAxios from '../plugins/myAxios';
import {Toast} from 'vant';
import {setCurrentUserState} from '../states/user';

const router = useRouter();
const route = useRoute();

const userAccount = ref('');
const userPassword = ref('');
const newUserAccount = ref('');
const newPassword = ref('');
const checkPassword = ref('');
const showRegister = ref(false);
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true; // 显示加载状态
  const res = await myAxios.post('/user/login', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
  });
  console.log(res, '用户登录');
  if (res.code === 0 && res.data) {
    setCurrentUserState(res.data);
    Toast.success('登录成功');
    router.push('/');  // 使用 Vue Router 进行重定向
  } else {
    Toast.fail('登录失败');
  }
};

const showRegisterDialog = () => {
  showRegister.value = true;
};

const onConfirmRegister = async () => {
  try {
    const res = await myAxios.post('/user/register', {
      userAccount: newUserAccount.value,
      userPassword: newPassword.value,
      checkPassword: checkPassword.value,
    });
    if (res.data === true) {
      Toast.success('注册成功');
    } else {
      Toast.fail('注册失败');
    }
    showRegister.value = false;
  } catch (error) {
    Toast.fail('注册失败');
  }
};
</script>

<style scoped>
.form-container {
  padding: 16px;
}

.button-container {
  width: 250px;
  margin-left: 50px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.register-link {
  text-align: right;
  margin-top: 8px;
}

.register-button {
  text-align: right;
  background-color: transparent;
  color: #409EFF;
  padding: 0;
  margin: 0;
  font-size: 14px;
  border-width: 0;
}

.register-button:hover {
  color: orange;
}

.register-button:active {
  color: black;
}
</style>
