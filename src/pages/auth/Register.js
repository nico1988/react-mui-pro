import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Link,
  Container,
  Typography,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
} from '@mui/material';
import { useCallback, useState, useEffect } from 'react';

import bigPic from '../../assets/images/reg/pic_register.png'
// hooks
import { useDispatch } from '../../redux/store';
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
import useLocales from '../../hooks/useLocales';
// store
import { setGlobalMessage } from '../../redux/slices/global';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import { RegisterForm, RegisterType, RegisterPay } from '../../sections/auth/register';
import Iconify from '../../components/Iconify';
import back from '../../assets/images/back.png'
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'flex-start',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 0),
  },
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(2)
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
  // [theme.breakpoints.down('xl')]: {
  //   maxWidth: 480,
  // },
}));
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));
function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled',
      }}
    >
      {completed ? (
        <Iconify icon={'eva:checkmark-fill'} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function Register(props) {
  const {
    backUrl,
  } = props;

  const dispatch = useDispatch();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  const { getI18nText } = useLocales('pages.auth.register');
  const { user, register } = useAuth();
  const [step, setStep] = useState(1);

  const [formValues, setFormValues] = useState();

  useEffect(() => {
    // 对于登录了没有vip的
    if (user && /[?&]step=3(&.*)?$/.test(window.location.search)) {
      setStep(3);
    };
  }, [user]);
 
  const steps = {
    length: 3,
    getComponents: (step) => {
      switch (step) {
        case 2:
          return <RegisterType onSubmit={value => {
            const values = {
              ...formValues,
              authorizeType: value,
            }
            setFormValues(values)
            onSubmit(values);
          }} />;
        case 3:
          return <RegisterPay />;
        default:
          return <RegisterForm formValues={formValues} onSubmit={values => {
            setFormValues(v => ({
              ...(v || {}),
              ...values,
            }))
            setStep(2);
          }} />;
      }
    }
  };

  const onSubmit = useCallback(async (values) => {
    if (!values) return;
    try {
      await register(values).then(res => {
        dispatch(setGlobalMessage({
          variant: 'success',
          msg: '注册成功',
        }))
        setStep(3);
        return res;
      }).catch(res => console.log(323));
    }  catch (error) {
      // if (isMountedRef.current) {
      //   setError('sendCode', { ...error, message: error.message });
      // }
    }
  }, []);


  return (
    <Page title={getI18nText('navTitle')}>
      <RootStyle>
        {mdUp && step !== 3 && (<>
          <HeaderStyle sx={{
            marginLeft: 7,
          }}>
            <Logo />
          </HeaderStyle>
          <SectionStyle sx={{
            px: 5
          }}>
            <Typography variant="h3" sx={{ mt: 10, mb: 5 }}>
              {getI18nText('title')}
            </Typography>
            <Image
              alt="register"
              src={bigPic}
              sx={{
                // width: 364
              }}
            />
          </SectionStyle>
        </>)}

        <Container sx={step === 3 ? {
          maxWidth: '1440px!important'
        } : {}}>
          <HeaderStyle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Image
                alt="back"
                src={back}
                sx={{ height: 18, mr: 1 }}
              />
              <Link variant="h6" sx={{
                  cursor: 'pointer',
                }} {...([2].includes(step) ? { onClick: () => setStep(v => v - 1) } : { to: backUrl || PATH_AUTH.login, component: RouterLink })}>
                Back
              </Link>
            </Box>
          </HeaderStyle>
          <ContentStyle sx={step === 3 ? {
            maxWidth: 1440,
            px: '10%',
            py: 0
          } : {}}>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant={step === 3 ? 'h6' : 'h4'} gutterBottom>
                  {getI18nText('appName', '', '', '')} - {getI18nText(String(step), 'stepsTitle')} {step}/{steps.length}
                </Typography>
                {step !== 3 && <Typography sx={{ color: 'text.secondary' }}>{getI18nText('formTips')}</Typography>}
              </Box>
            </Box>
            <Stepper sx={{ mb: 5 }} alternativeLabel activeStep={step - 1} connector={<QontoConnector />}>
              {Array.from({ length: steps.length + 1 }).map((_, index) => index && (
                <Step key={index}>
                  <StepLabel StepIconComponent={QontoStepIcon}>{getI18nText(String(index), 'steps')}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {steps.getComponents(step)}

          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
