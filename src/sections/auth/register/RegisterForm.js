import * as Yup from 'yup';
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert, Typography, Link, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/system';
// service/store
import { getCode, checkUsable } from '../../../services/accounts';
import { setGlobalMessage } from '../../../redux/slices/global';
import { dispatch } from '../../../redux/store';

// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useLocales from '../../../hooks/useLocales';
import useResponsive from '../../../hooks/useResponsive';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// ----------------------------------------------------------------------

const defaultValues = {
  username: '',
  password: '',
  phone: '',
  code: '',
  email: '',
};

export default function RegisterForm(props) {
  const { register } = useAuth();
  const theme = useTheme();
  const isMountedRef = useIsMountedRef();
  const { getI18nText } = useLocales('sections.auth.register');
  const smUp = useResponsive('up', 'sm');

  const { formValues, onSubmit } = props;

  const [showPassword, setShowPassword] = useState(false);
  // 检查是否可用
  const isCheckedRef = useRef({
    username: false,
    phone: false,
    email: false,
  });
  const checkingRef = useRef({
    username: false,
    phone: false,
    email: false,
  });
  // 验证码倒计时
  const [codeCountdown, setCodeCountdown] = useState(0);
  const countdownTimer = useRef();

  // 翻译文案
  const getText = useCallback(
    (key, type = 'placeholder', otherValue = '') => {
      if (!getI18nText) return '';
      switch (type) {
        case 'required':
        case 'placeholder':
          return getI18nText(key, type, `请输入${getI18nText(key, 'label')}`);
        case 'verify':
          return getI18nText(key, type, `请输入正确的${getI18nText(key, 'label')}`);
        case 'max':
        case 'min':
          return getI18nText(
            key,
            type,
            `${getI18nText(key, 'label')}长度${type === 'max' ? '最多' : '至少'}${otherValue}位`
          );
        default:
          return getI18nText(key, type);
      }
    },
    [getI18nText]
  );

  // 表单相关
  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .required(getText('username', 'required'))
      .matches(/^[0-9a-zA-Z\u4e00-\u9fa5]+$/, getText('username', 'verify'))
      .max(12, getText('username', 'max')),
    password: Yup.string().required(getText('password', 'required')).min(6, getText('password', 'min', 6)),
    phone: Yup.string()
      .required(getText('phone', 'required'))
      .matches(/^1\d{10}$/, getText('phone', 'verify')),
    code: Yup.string().required(getText('code', 'required')),
    email: Yup.string().required(getText('email', 'required')).email(getText('email', 'verify')),
  });
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues: formValues || defaultValues,
    onBlur: (...v) => console.log(v),
  });

  const {
    reset,
    setError,
    clearErrors,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // 验证码倒计时
  const countdownHandle = useCallback(
    async (number) => {
      if (number <= 0) return;
      if (countdownTimer.current) window.clearInterval(countdownTimer.current);
      setCodeCountdown(number);
      countdownTimer.current = window.setInterval(() => {
        setCodeCountdown((v) => {
          if (v - 1 < 1) {
            window.clearInterval(countdownTimer.current);
            countdownTimer.current = null;
            return 0;
          }
          return v - 1;
        });
      }, 1000);
    },
    [countdownTimer]
  );

  // 发送验证码
  const sendCode = useCallback(async () => {
    if (codeCountdown) return;
    const phone = getValues().phone;
    const preCheckedStatus = isCheckedRef.current;
    if (!preCheckedStatus.phone) {
      // 减少同时检查
      if (checkingRef.current.phone) return setTimeout(sendCode, 500);
      if (!(await checkValues('phone', phone))) return false;
    }

    try {
      await getCode({
        phone,
      }).then((res) => {
        dispatch(
          setGlobalMessage({
            variant: 'success',
            msg: '发送成功, 请查收',
          })
        );
        countdownHandle(60);
      });
    } catch (error) {
      // if (isMountedRef.current) {
      //   setError('sendCode', { ...error, message: error.message });
      // }
    }
  }, [checkingRef, isCheckedRef, codeCountdown, countdownHandle, getValues]);

  // 修改可用状态
  const checkedStateHandle = useCallback(
    (key: string, value: boolean) => {
      if (!key) return false;
      const preValues = isCheckedRef.current;
      if (!preValues || preValues[key] === value) return;

      isCheckedRef.current = {
        ...preValues,
        [key]: value,
      };
    },
    [isCheckedRef]
  );

  // 接口检查是否可用
  const checkValues = useCallback(
    async (key, value, must = 0) => {
      if (!key || !value || (checkingRef.current[key] && !must)) return false;
      checkingRef.current[key] = true;
      const result = await checkUsable({
        [key]: value,
      }).catch((err) => {
        setError(key, { ...err, message: err.message });
      });
      if (result?.result) {
        clearErrors(key);
        checkedStateHandle(key, true);
        checkingRef.current[key] = false;
        return true;
      }
      checkingRef.current[key] = false;
      return false;
    },
    [clearErrors, setError, checkedStateHandle, checkingRef]
  );

  // 提交到上一层前
  const beforeSubmit = useCallback(
    async (values) => {
      // 确认是否所有可用都确认了
      const preCheckedStatus = isCheckedRef.current;
      const checkingStatus = checkingRef.current;
      const cKeys = Object.keys(preCheckedStatus);
      const errorCount = (
        await Promise.all(
          cKeys.map(async (key) => {
            if (preCheckedStatus[key]) return true;
            const result = await checkValues(key, values[key], 1);
            return result;
          })
        )
      ).filter((v) => !v).length;

      if (!errorCount) onSubmit(values);
    },
    [isCheckedRef, onSubmit]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(beforeSubmit)}>
      <Stack
        spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField
            name="username"
            label={getText('username', 'label')}
            placeholder={getText('username', 'placeholder')}
            inputProps={{
              onChange: () => checkedStateHandle('username', false),
            }}
            onBlur={(e) => checkValues('username', e.target.value)}
          />
          <RHFTextField
            name="password"
            label={getText('password', 'label')}
            type={showPassword ? 'text' : 'password'}
            placeholder={getText('password', 'placeholder')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <RHFTextField
          name="phone"
          label={getText('phone', 'label')}
          placeholder={getText('phone', 'placeholder')}
          onBlur={(e) => checkValues('phone', e.target.value)}
          inputProps={{
            onChange: () => checkedStateHandle('phone', false),
          }}
          InputProps={{
            endAdornment: (
              <Button
                disabled={codeCountdown > 0}
                variant="h6"
                sx={{
                  whiteSpace: 'nowrap',
                  color: theme.palette.primary.main,
                  cursor: 'pointer',
                }}
                onClick={() => sendCode()}
              >
                {codeCountdown > 0
                  ? getText('codeCountdown', 'text').replace('{{value}}', codeCountdown)
                  : getText('getCode', 'button')}
              </Button>
            ),
          }}
        />
        <RHFTextField name="code" label={getText('code', 'label')} placeholder={getText('code', 'placeholder')} />
        <RHFTextField
          name="email"
          label={getText('email', 'label')}
          placeholder={getText('email', 'placeholder')}
          onBlur={(e) => checkValues('email', e.target.value)}
          inputProps={{
            onChange: () => checkedStateHandle('email', false),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          {getText('next', 'button')}
        </LoadingButton>
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
          {getText('agreeTips', 'text')} &nbsp;
          <Link underline="always" color="text.primary" href="#">
            《{getText('agreeTitle', 'text')}》
          </Link>
          {getI18nText('and', 'text')}
          <Link underline="always" color="text.primary" href="#">
            《{getText('privacyTitle', 'text')}》
          </Link>
        </Typography>

        {!smUp && (
          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            {getText('hasAccount', 'text')}&nbsp;&nbsp;
            <Link variant="subtitle2" to={PATH_AUTH.login} component={RouterLink}>
              {getText('login', 'text')}
            </Link>
          </Typography>
        )}
      </Stack>
    </FormProvider>
  );
}
