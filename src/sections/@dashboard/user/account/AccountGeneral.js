import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { updateAccountInfo, getAccountInfo } from '../../../../services/accounts';
import { setGlobalMessage } from '../../../../redux/slices/global';
import { useDispatch } from '../../../../redux/store';
// hooks
import useLocales from '../../../../hooks/useLocales';
import useAuth from '../../../../hooks/useAuth';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
// utils
import { fData } from '../../../../utils/formatNumber';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const formItems = {
  info: [
    {
      key: 'name',
      valueKey: 'name',
      onlyRead: true,
    },
    {
      key: 'email',
      valueKey: 'email',
      onlyRead: true,
    }, 
    {
      key: 'phone',
      valueKey: 'phone',
      onlyRead: true,
    },
    {
      key: 'enterpriseName',
      valueKey: 'enterpriseName',
    }
  ],
  subInfo: [
  ],
  // switch: [
  //   {
  //     key: 'wareHouse',
  //     valueKey: '1',
  //   },
  //   {
  //     key: 'customer',
  //     valueKey: '2',
  //   },
  //   {
  //     key: 'zeroStock',
  //     valueKey: '3',
  //   }
  // ]
}


export default function AccountGeneral() {
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { getI18nText } = useLocales('sections.dashboard.userAccount.general');
  const [ account, setAccount ] = useState();

  useEffect(() => {
    getAccountInfo().then(res => {
      if (isMountedRef.current) {
        setAccount(res.data);
      }
    });
  }, [isMountedRef]);

  
  const defaultValues = {
    name: '',
    email: '',
    iconUrl: '',
    phone: '',
    enterpriseName: '',
  };
  
  const UpdateUserSchema = Yup.object().shape({
    enterpriseName: Yup.string().required(getI18nText('enterpriseName', 'required', 'enterpriseName is required')),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (account && reset) reset({
      name: account?.name || '',
      email: account?.email || '',
      iconUrl: account?.iconUrl || user?.iconUrl || '',
      phone: account?.phone || '',
      enterpriseName: account?.enterpriseName || '',
    })
  }, [account, reset]);
  
  const onSubmit = async (values) => {
    const { iconUrl, ...other } = values;
    try {
      await updateAccountInfo(other);
      dispatch(setGlobalMessage({
        variant: 'success',
        msg: getI18nText('uSuccess', 'tips','Update success!'),
      }))
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  if (!account) return null;
  
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center', height: '100%' }}>
            <RHFUploadAvatar
              name="iconUrl"
              accept="image/*"
              maxSize={3145728}
              // onDrop={handleDrop}
              // helperText={
              //   <Typography
              //     variant="caption"
              //     sx={{
              //       mt: 3,
              //       mx: 'auto',
              //       display: 'block',
              //       textAlign: 'center',
              //       color: 'text.secondary',
              //     }}
              //   >
              //     {getI18nText('allowed')} *.jpeg, *.jpg, *.png, *.gif
              //     <br /> {getI18nText('maxSizeOf', '', 'max size of')} {fData(3145728)}
              //   </Typography>
              // }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3,  height: '100%'}}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {formItems.info.map(v => <RHFTextField name={v.valueKey} disabled={v.onlyRead} label={getI18nText(v.key, 'label')} key={v.key} />)}
              
              <Stack direction="row" spacing={3} sx={{
                gridColumn: '1 / span 2',
                color: '#637381',
              }}>
                <Typography variant="body1">
                {getI18nText('authStatus', 'label')}：{getI18nText(account.authorizeState, 'value.authStatus')}
                </Typography>
                <Typography variant="body1">
                {getI18nText('whouseCount', 'label')}：{account.warehouseCount}
                </Typography>
                <Typography variant="body1">
                {getI18nText('subCount', 'label')}：{account.subCount}/{account.maxSubCount}
                </Typography>
              </Stack>

              {/* <Stack spacing={0.8} sx={{
                gridColumn: '1 / span 2',
              }}>
                <Typography variant="body2" sx={{
                  color: '#637381',
                  fontWeight: 'bold',
                }}>{getI18nText('pmSetting', '', 'Permission Setting')}</Typography>

                {formItems.switch.map(v => <Stack direction="row" alignItems="center" key={v.key}>
                  <Typography variant="body1">{getI18nText(v.key, 'label')}：</Typography>
                  <RHFSwitch name={v.valueKey} label="" sx={{ m: 0 }}/>
                  <Typography variant="body1">（{getI18nText(v.key, 'tips')}）</Typography>
                </Stack>)}
              </Stack> */}

              {/* <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {getI18nText('saveChange', 'button')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
