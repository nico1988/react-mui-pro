import React, { Component, useState, Fragment, useEffect, useCallback, useRef, useMemo } from 'react'
import { 
  Box, Typography, Button, Dialog, 
  DialogContent, Alert, Modal, Paper, 
  Stack } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ShieldIcon from '@mui/icons-material/Shield';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import useLocales from 'src/hooks/useLocales';
import useAuth from 'src/hooks/useAuth';
import { getPayInfo, getServicesList, checkScanResult, checkPayResult } from 'src/services/services';

import Image from 'src/components/Image';
import Iconify from 'src/components/Iconify';

import iconWechat from 'src/assets/images/reg/icon_wechatPay.png';
import iconAlipay from 'src/assets/images/reg/icon_alipay.png';

const icon = {
  'wechat': iconWechat,
  'alipay': iconAlipay,
}

const config = [
  'time',
  {
    key: 'realtime',
    disabled: (value = {}) => value.desc === 'GENERAL',
  },
  'scan',
  'e&A',
  'goods',
  'history',
  {
    key: 'deposit',
    disabled: (value = {}) => value.desc === 'GENERAL',
  },
  {
    key: 'refund',
    disabled: (value = {}) => value.desc === 'GENERAL',
  },
  {
    key: 'wHouse',
    dataKey: 'warehouseCount',
  },
  {
    key: 'subAccount',
    dataKey: 'subAccountCount',
  }
]


const Reg3 = (props) => {
  const { isSubmitting } = props;
  const { getCurrentUser } = useAuth();
  const theme = useTheme();
  const { getI18nText } = useLocales('sections.auth.register');
  const [serviceList, setServiceList] = useState();
  const [userType, setUserType] = useState('');

  // 支付信息-二维码那一层
  const [payInfo, setPayInfo] = useState();
  const [showDialog, setShowDialog] = useState(false);

  // 结果弹窗
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [payResult, setPayResult] = useState();

  // 各种延时器/临时变量
  const scanTimer = useRef();
  const payServiceId = useRef(); // 支付中的套餐id

  useEffect(() => {
    // 获取套餐列表
    getServicesList().then(res => {
      const list = res.data || [];
      setServiceList(list);
      setUserType(list[0].authorizeType)
    })
  }, []);

  // 弹窗关闭时清除定时器
  useEffect(() => {
    if (!showDialog) {
      clearTimer(scanTimer);
      setPayResult(undefined);
    }
  }, [showDialog, clearTimer]);

  useEffect(() => {
    if (payResult !== undefined) setShowResultDialog(false);
  }, [payResult]);

  // 选择购买服务
  const choiceServices = useCallback(async (id) => {
    if (!id) return false;
    const res = await getPayInfo({
      qrCodeSize: 100,
      quantity: 1,
      serviceInfoId: id,
    });
    const resData = res.data;
    payServiceId.current = id;
    setPayInfo(resData);
    setShowDialog(true);
    checkIsScan(resData.id);
    return true;
  }, [setPayInfo, setShowDialog, checkIsScan]);

  // 定时器清除
  const clearTimer = useCallback((timerRef, type = 'interval') => {
    if (!timerRef.current) return;
    window[type === 'interval' ? 'clearInterval' : 'clearTimeout'](timerRef.current);
    timerRef.current = undefined;
  }, []);

  // 轮询查询用户是否扫码 - 持续到用户扫码付款或弹窗关闭
  const checkIsScan = useCallback(async (orderId) => {
    clearTimer(scanTimer);
    scanTimer.current = window.setInterval(async () => {
      const scanRes = await checkScanResult(orderId);
      if (scanRes.data?.scan) {
        clearTimer(scanTimer);
        setShowResultDialog(true);
      }
    }, 1500);
  }, []);

  // 查询支付结果, 在用户点击结果弹窗后调用
  const checkResult = useCallback(async (orderId) => {
    const payRes = await checkPayResult(orderId);
    const result = payRes.data?.result;
    if (!result) {
      // 重新获取支付信息
      payError();
    } else {
      setPayResult(true);
      setTimeout(paySuccess, 3000);
    }
  }, [payError, paySuccess])

  // 支付失败.重新获取支付信息
  const payError = useCallback(async () => {
    if (!payServiceId.current) return;
    setPayResult(false);
    choiceServices(payServiceId.current);
  }, [payServiceId, choiceServices]);

  const paySuccess = useCallback(async () => {
    // 用户信息有vip状态会自动跳去首页
    await getCurrentUser();
  }, [getCurrentUser]);

  if (!serviceList) return null;
  return <>
    <Typography sx={{
      textAlign: 'center'
    }} variant="h4">{getI18nText(userType, 'userType.name')}</Typography>
    <Box sx={{
      display: 'flex',
      mt: 5,
      mb: 6.5
    }}>
      {[{}, ...serviceList]?.map((v, xIndex) => <Box key={xIndex} sx={{
        flexShrink: 0,
        flex: xIndex ? 1 : 0.4,
        position: 'relative',
        color: theme.palette.text.secondary,
        ...(v.priceDesc === '年' ? {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          borderRadius: 1.5
        } : {})
      }}>
        {v.priceDesc === '年' && <Typography variant="body2" sx={{
          position: 'absolute',
          right: 0,
          top: '16px',
          px: 1,
          pr: 0.63,
          fontWeight: 'bold',
          lineHeight: '22px',
          borderRadius: '6px 0 0 6px',
          color: theme.palette.info.dark,
          background: alpha(theme.palette.info.main, 0.16),
        }}>{getI18nText('mostPopular', 'text')}</Typography>}
        {config.map((c, index) => <Box key={index} borderBottom={1} borderColor={theme.palette.action.selected}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: xIndex ? 'center' : 'flex-start',
            justifyContent: 'center',
            height: 54,
            '&:first-of-type': {
              height: 212,
            }
          }}>
          {(() => {
            const { key, dataKey, disabled } = (typeof c === 'string' ? { key: c } : c);
            const title = key ? getI18nText(key, 'serviceItems') : '';
            // 套餐价格天数等信息
            if (!index) return <Fragment key={index}>
              <Typography variant="body2" sx={{
                height: 34,
                fontWeight: 'bold',
                color: theme.palette.text.secondary,
              }}>{xIndex ? v.title : ''}</Typography>
              <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 64,
                mb: 2,
                color: theme.palette.text.secondary,
              }}>
                {!!xIndex && <Fragment key={xIndex}>
                  <Typography variant="body1" sx={{
                    alignSelf: 'flex-start',
                    fontWeight: 'bold',
                  }}>¥</Typography>
                  <Typography sx={{
                    ml: 0.2,
                    mr: 0.8,
                    fontSize: 48,
                    fontWeight: 'bold',
                    color: theme.palette.text.primary,
                  }}>{v.price / 100}</Typography>
                  <Typography variant="body1" sx={{
                    alignSelf: 'flex-end',
                  }}>/{v.priceDesc}</Typography>
                </Fragment>}
              </Box>
              <Typography variant="body2" sx={{
                color: theme.palette.primary.main,
                ...(xIndex ? {} : {
                  fontWeight: 'bold',
                })
              }}>{!xIndex ? title : v.desc}</Typography>
            </Fragment>
            if (!xIndex) return <Typography variant={!index ? 'body2' : 'body1'} sx={{
              color: theme.palette.text.primary,
            }}>{title}</Typography>
            const value = dataKey ? v[c.dataKey] : '';
            if (value) return <Typography variant="body1" sx={{
              color: 'inherit'
            }}>{value}</Typography>;
            if (disabled && disabled(v)) return '—';
            return <Iconify icon={'eva:checkmark-fill'} sx={{ width: 20, height: 20, color: 'primary.main' }} />;
          })()}
        </Box>)}
        {!!xIndex && <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 96,
          px: '15%',
        }}>
          <Button variant="contained" sx={{
            width: '100%',
            height: 48,
            boxSizing: 'border-box',
          }} onClick={() => choiceServices(v.id)}>
            {getI18nText('choose', 'button')}
          </Button>
        </Box>}
      </Box>)}
    </Box>

    {/* 支付弹窗 */}
    <Dialog open={showDialog} onClose={payResult ? undefined : () => setShowDialog(false)} maxWidth="md" >
      {payInfo && <DialogContent sx={{
        display: 'flex',
        p: 0,
        bgcolor: theme.palette.action.hover
      }}>
        {payResult !== undefined && <Alert severity={payResult ? 'success' : 'error'} onClick={payResult ? paySuccess : undefined} sx={{
          position: 'absolute',
          left: '50%',
          top: '8px',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}>{getI18nText(payResult ? 'paySuccess' : 'payError', 'text')}</Alert>}
        <Box sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          fontSize: 28
        }}>
          <CloseOutlinedIcon onClick={payResult ? undefined : () => setShowDialog(false)} sx={{
            fontSize: 'inherit'
          }} />
        </Box>
        {/* 支付弹窗 - 左 */}
        <Box sx={{
          flexShrink: 0,
          width: 368,
          p: 5,
        }}>
          <Typography variant="h5" sx={{ mb: 3 }}>{getI18nText('orderDetail', 'title')}</Typography>
          <Box sx={{ display: 'flex', justifyContent: "space-between", mb: 2.5, pt: 1.5 }}>
            <Typography variant="body1" sx={{
              fontWeight: 'bold',
              color: theme.palette.text.secondary
            }}>{getI18nText('order', 'text')} {payInfo.title}</Typography>
            <Typography variant="body2" sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1,
              fontWeight: 'bold',
              borderRadius: '6px',
              background: theme.palette.error.main,
              color: theme.palette.common.white,
            }}>{payInfo.title}</Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: 64,
            pr: 1,
            mb: 2.5,
            color: theme.palette.text.secondary,
          }}>
            <Typography variant="body1" sx={{
              alignSelf: 'flex-start',
              fontWeight: 'bold',
            }}>¥</Typography>
            <Typography sx={{
              ml: 0.2,
              mr: 0.8,
              fontSize: 48,
              fontWeight: 'bold',
              color: theme.palette.text.primary,
            }}>{(payInfo.amount / payInfo.quantity / 100).toFixed(2)}</Typography>
            <Typography variant="body1" sx={{
              alignSelf: 'flex-end',
              pb: 1,
            }}>/{payInfo?.priceDesc}</Typography>
          </Box>
          <Box borderTop={1}
            borderBottom={1}
            borderColor={theme.palette.divider}
            sx={{
              py: 2.5,
              mb: 5,
              borderStyle: 'dashed',
              borderRight: 'none',
              borderLeft: 'none'
            }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} mb={2.5}>
              <Typography variant="h6">{getI18nText('count', 'title')}</Typography>
              <Typography variant="h6">1</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">{getI18nText('total', 'title')}</Typography>
              <Typography variant="h6">¥{(payInfo.amount / 100).toFixed(2)}</Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            mx: 'auto',
            fontWeight: 'bold',
          }}>
            <ShieldIcon color="primary" sx={{ mr: 1, width: 24, height: 24 }} />{getI18nText('securePay', 'text')}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary} textAlign="center">{getI18nText('GOPROSecurity', 'text')}</Typography>
        </Box>
        {/* 支付弹窗 - 右 */}
        <Box sx={{
          flex: 1,
          pl: 1,
          pr: 4,
          py: 5
        }}>
          <Typography variant="h5" sx={{ mb: 3 }}>{getI18nText('paymentChoice', 'title')}</Typography>
          <Box border={1} borderColor={theme.palette.divider}
            sx={{
              py: 4,
              px: 3,
              borderRadius: 1,
            }}>
            {['wechat', 'alipay'].map(v => <Box key={v} sx={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              '&:first-of-type': {
                mb: 5
              }
            }}>
              <Image src={payInfo[v === 'wechat' ? 'weixinPayQRCode' : 'alipayPayQRCode']} sx={{
                width: 120,
                height: 120,
                mr: 1,
              }} />
              <Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Image src={icon[v]} sx={{
                    width: 40,
                    height: 40,
                    mr: 1,
                  }} />
                  <Typography variant="h6">{getI18nText(v, 'text.payType')}</Typography>
                </Box>
                <Box variant="body1" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 40
                }}>
                  {getI18nText('pay', 'text')} &nbsp;
                  <Typography variant="h5" color={theme.palette.error.main}>{(payInfo?.amount / 100).toFixed(2)}</Typography> &nbsp;
                  {getI18nText('¥', 'unit')}
                </Box>
                <Typography variant="body2" color={theme.palette.text.secondary}>{getI18nText('agreeBeforeOpen', 'text')}《{getI18nText('serviceTitle', 'text')}》</Typography>
              </Box>
            </Box>)}
          </Box>
        </Box>
      </DialogContent>}
    </Dialog>

    {/* 支付确认弹窗 */}
    <Modal
      open={showResultDialog}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Paper sx={{ 
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 240, 
          py: 2,
          textAlign: 'center'
        }}>
        <Typography variant="h6" mb={2}>确认是否已经支付成功?</Typography>
        <Stack spacing={2} direction="row" justifyContent="center">
          <Button variant="outlined" onClick={payError}>否</Button>
          <Button variant="contained" onClick={() => checkResult(payInfo.id)}>是</Button>
        </Stack>
      </Paper>
    </Modal>
  </>
}

export default Reg3
