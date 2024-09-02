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
            :rules="[
            { required: true, message: '请填写用户名' },
            { pattern: /^.{4,}$/, message: '账号长度必须大于等于4位' }
          ]"
        />
        <van-field
            v-model="userPassword"
            type="password"
            name="userPassword"
            label="密码"
            placeholder="请输入密码"
            required
            :rules="[
            { required: true, message: '请填写密码' },
            { pattern: /^.{8,}$/, message: '密码长度必须大于等于8位' }
          ]"
        />
      </van-cell-group>
      <div class="button-container">
        <van-button round block :loading="isLoading" type="primary" native-type="submit">
          登录
        </van-button>
      </div>
      <div class="link-container">
        <a class="forgot-password-link" @click="onForgotPasswordClick">忘记密码</a>
        <a class="register-link" @click="showRegisterDialog">没有账号？注册</a>
      </div>
      <van-notify v-model:show="showNotify" type="success">
        <van-icon name="bell" style="margin-right: 4px;"/>
        <span>目前邮件注册只支持Gmail、QQ、163</span>
      </van-notify>
    </van-form>
  </div>
  <van-dialog v-model:show="showForgetPassword" title="找回密码" show-cancel-button @confirm="onConfirmFindPassword"
              @cancel="onCancelFindPassword">
    <van-form @submit.prevent="onConfirmFindPassword">
      <van-field
          v-model="email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          required
          :rules="[
            { required: true, message: '请填写邮箱' },
            { pattern: /^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/, message: '请输入有效邮箱' }
          ]"
      />
    </van-form>
  </van-dialog>
  <!--注册弹出框  -->
  <van-dialog v-model:show="showRegister" title="注册" show-cancel-button @confirm="onConfirmRegister"
              @cancel="onCancelRegister">
    <van-form @submit.prevent="onConfirmRegister">
      <div>
        <van-field
            v-model="newUserAccount"
            name="newUsername"
            label="用户名"
            placeholder="请输入用户名"
            required
            :rules="[
            { required: true, message: '用户名不能为空' },
            { pattern: /^.{4,}$/, message: '用户名长度必须大于等于4位' }
          ]"
        />
        <van-field
            v-model="verifyMethod"
            name="registerMethod"
            label="邮箱/手机号"
            placeholder="请输入邮箱或手机号"
            required
            :rules="[
            { required: true, message: '请填写邮箱或手机号' },
            { pattern: /^(1\d{10}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/, message: '请输入有效的手机号或邮箱' }
          ]"
        />
        <van-field
            v-model="nickName"
            name="nickName"
            label="昵称"
            placeholder="请输入昵称"
            required
            :rules="[
            { required: true, message: '昵称不能为空' },
            { pattern: /^.{3,}$/, message: '昵称长度必须大于等于3位' }
          ]"
        />
        <van-field
            v-model="newPassword"
            name="newPassword"
            label="密码"
            type="password"
            placeholder="请输入密码"
            required
            :rules="[
            { required: true, message: '密码不能为空' },
            { pattern: /^.{8,}$/, message: '密码长度必须大于等于8位' }
          ]"
        />
        <van-field
            v-model="checkPassword"
            name="checkPassword"
            label="确认密码"
            type="password"
            placeholder="请再次输入密码"
            required
            :rules="[
            { required: true, message: '请再次输入密码' },
            { validator: matchPasswords, message: '两次输入的密码不一致' }
          ]"
        />
      </div>
      <div class="verification-container">
        <van-field v-model="verifyCode" name="verifyCode" label="验证码" placeholder="请输入验证码" required/>
        <van-count-down v-if="showCountDown" :time="time" format="ss" :auto-start="start"/>
        <van-button block type="primary" size="small" @click="getVerificationCode">点击获取</van-button>
      </div>
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
const email = ref('');
const verifyMethod = ref('');
const verifyCode = ref('');
const userPassword = ref('');
const newUserAccount = ref('');
const nickName = ref('');
const newPassword = ref('');
const checkPassword = ref('');
const showRegister = ref(false);
const isLoading = ref(false);
const showNotify = ref(false);
const time = ref(60 * 1000);
const start = ref(false);
const showCountDown = ref(false)
const showForgetPassword = ref(false);

const matchPasswords = (value) => {
  return value === newPassword.value;
};
const onSubmit = async () => {
  isLoading.value = true; // 显示加载状态

  try {
    const res = await Promise.race([
      myAxios.post('/user/login', {
        userAccount: userAccount.value,
        userPassword: userPassword.value,
      }),
      new Promise((_, reject) =>
          setTimeout(() => reject(new Error('请求超时')), 10000) // 设置10秒超时
      )
    ]);

    if (res.code === 0 && res.data) {
      setCurrentUserState(res.data);
      Toast.success('登录成功');
      router.push('/');  // 使用 Vue Router 进行重定向
    } else {
      Toast.fail('登录失败');
    }
  } catch (error) {
    if (error.message === '请求超时') {
      Toast.fail('登录超时');
    }
  } finally {
    isLoading.value = false;
  }
};
const onForgotPasswordClick = () => {
  showForgetPassword.value = true;
}
const showRegisterDialog = () => {
  showNotify.value = true;
  showRegister.value = true;
};

/**
 * 提交注册
 */
const onConfirmRegister = async () => {
  try {
    const res = await myAxios.post('/user/register', {
      userAccount: newUserAccount.value,
      registerMethod: verifyMethod.value,
      userPassword: newPassword.value,
      checkPassword: checkPassword.value,
      verifyCode: verifyCode.value,
    });
    if (res.code === 0) {
      Toast.success('注册成功');
    } else {
      Toast.fail('注册失败');
    }
  } catch (error) {
    Toast.fail('验证码错误');
  }
  showNotify.value = false;
  showRegister.value = false;
};

const onCancelRegister = () => {
  showNotify.value = false;
  showRegister.value = false;
}
/**
 * 找回密码
 */
const onConfirmFindPassword = async () => {
  try {
    const res = await myAxios.get('/user/find/password', {
      params: {
        email: email.value,
      }
    });
    if (res.data === 1) {
      Toast.success('重置密码成功');
      // 修改密码
    } else {
      Toast.fail('重置密码失败');
    }
  } catch (error) {
    Toast.fail('重置密码失败');
  }
  showForgetPassword.value = false;
};

const onCancelFindPassword = () => {
  showForgetPassword.value = false;
}
const getVerificationCode = async () => {
  try {
    // 发送 GET 请求获取验证码
    const res = await myAxios.get('/user/get/verifyCode', {
      params: {
        registerMethod: verifyMethod.value,
      }
    });

    if (res.code === 0) {
      showCountDown.value = true;
      start.value = true;
      Toast.success('验证码已发送');
    } else {
      Toast.fail(res.data.message || '验证码发送失败，请重试。');
    }
  } catch (error) {
    Toast.fail('获取验证码错误');
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

.link-container {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.forgot-password-link,
.register-link {
  color: #409EFF;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
}

.forgot-password-link:hover,
.register-link:hover {
  color: orange;
}

.forgot-password-link:active,
.register-link:active {
  color: black;
}


.verification-container {
  display: flex;
  align-items: center;
}

.verification-container .van-field {
  flex: 1;
}

.verification-container .van-count-down {
  margin-right: 5px;
}

.verification-container .van-button {
  width: 67px;
  margin-right: 10px;
  flex-shrink: 0;
}
</style>
