import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/system';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useLocales from '../../../hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function LoginForm(props) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  const theme = useTheme();
  const { getI18nText } = useLocales('sections.auth.login');

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required(getI18nText('username', 'required')),
    password: Yup.string().required(getI18nText('password', 'required')),
  });

  const defaultValues = {
    username: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const { username, password, remember } = data;
    try {
      await login({
        username,
        password
      }, remember).then(res => {
        navigate(`${PATH_AUTH.register}?step=3`)
      });
    } catch (error) {
      console.log(error)
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.error_description });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="username" label={getI18nText('username', 'label')} 
          placeholder={getI18nText('username', 'required')} />

        <RHFTextField
          name="password"
          label={getI18nText('password', 'label')}
          type={showPassword ? 'text' : 'password'}
          placeholder={getI18nText('password', 'required')} 
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label={getI18nText('remember', 'label')} />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.register}>
          {getI18nText('register', 'button')}
        </Link>

      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
      {getI18nText('login', 'button')}
      </LoadingButton>
    </FormProvider>
  );
}
