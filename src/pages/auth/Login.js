import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/system';
import { Box, Card, Stack, Link, Alert, Tooltip, Container, Typography, Popper, CardContent } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// image
import qrcode from '../../assets/images/qrcode/service.jpg'
import bigPic from '../../assets/images/reg/pic_login.png'
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';

// sections
import { LoginForm } from '../../sections/auth/login';

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
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
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
}));

// ----------------------------------------------------------------------

export default function Login(props) {
  const { method } = useAuth();
  const theme = useTheme();
  const { getI18nText } = useLocales('pages.auth.login');
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  const [qrcodeOpen, setQrcodeOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Page title={getI18nText('login')}>
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle sx={{
            px: 5,
          }}>
            <Typography variant="h3" sx={{mt: 10, mb: 5 }}>
              {getI18nText('welcome', '', 'Hi, Welcome Back')}
            </Typography>
            <Image
              alt="login"
              src={bigPic}
            />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {getI18nText('signIn')}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {getI18nText('subtitle', '', 'Enter your details below.')}
                </Typography>
              </Box>
            </Stack>
            <Alert severity="info" sx={{ mb: 3 }}>
              {getI18nText('loginTips')}
              {getI18nText('addService').split('{{value}}').map((v, index) => {
                if (index) return v;
                return <Typography component="span" variant="body2" key={index}>
                        {index ? v : <>{v}<Typography variant="body2" component="span" sx={{
                              color: theme.palette.primary.dark,
                              cursor: 'pointer'
                            }} onClick={(e) => {
                              setAnchorEl(e.currentTarget || e.target)
                              setQrcodeOpen(v => !v);
                            }}>{getI18nText('qrcode')}</Typography></>}
                       </Typography>
              })}
              <Popper
                  open={qrcodeOpen}
                  anchorEl={anchorEl}
                  onClose={() => setQrcodeOpen(false)}
                  placement="top"
                >  
                <Card variant="outlined" sx={{ my: 1 }}>
                  {/* <CardContent> */}
                    <Typography m={1}>
                      <Image
                        sx={{
                          width: 140
                        }}
                        alt="qrcode"
                        src={qrcode}
                      />
                    </Typography>
                  {/* </CardContent> */}
                </Card>
              </Popper>
            </Alert>
            <LoginForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}

