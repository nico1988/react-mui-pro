import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { changePassword } from '../../../../services/accounts';
import { setGlobalMessage } from '../../../../redux/slices/global';
import { useDispatch } from '../../../../redux/store';
// hooks
import useLocales from '../../../../hooks/useLocales';
import useAuth from '../../../../hooks/useAuth';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const formItems = [
  {
    key: 'oldPassword',
  },
  {
    key: 'password',
  },
  {
    key: 'confirmPassword',
  },
]
export default function AccountChangePassword() {
  const dispatch = useDispatch();
  const { getI18nText } = useLocales('sections.dashboard.userAccount.cPwd');
  const { logout } = useAuth();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required(getI18nText('oPwd', 'required', 'Old Password is required')),
    password: Yup.string().min(6, getI18nText('nPwdV', 'required', 'Password must be at least 6 characters')).required(getI18nText('nPwd', 'required', 'New Password is required')),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], getI18nText('cnPwd', 'required', 'Passwords must match')),
  });

  const defaultValues = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values) => {

    try {
      await changePassword(values);
      reset();
      dispatch(setGlobalMessage({
        variant: 'success',
        msg: getI18nText('uSuccess', 'tips','Update success!'),
      }))
      setTimeout(logout, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          {formItems.map(v => <RHFTextField name={v.valueKey || v.key} type="password" key={v.key}
                                placeholder={getI18nText(v.key, 'placeholder')}/>)}

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {getI18nText('saveChange', 'button')}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
