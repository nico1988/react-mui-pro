import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';
// @mui
import {
  Box,
  InputAdornment,
  Dialog,
  Stack,
  Typography,
  Button,
  DialogActions,
  Divider,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
// components
import MuiAlert from '@mui/material/Alert';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';
import { setGlobalMessage } from '../../../../redux/slices/global';
import { useDispatch } from '../../../../redux/store';
import { addUserAccount, editUserAccount } from '../../../../services/user-manage';
import { getRolesList } from '../../../../services/roles';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#00AB55',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#00AB55',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#00AB55',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#00AB55',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  // eslint-disable-next-line react/prop-types
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <div className="QontoStepIcon-completedIcon QontoStepIcon-circle" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const REG_TEL = /^1[3456789]\d{9}$/;

AddRoleDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  getList: PropTypes.func,
  type: PropTypes.string,
  selectedData: PropTypes.object,
};

export default function AddRoleDialog({ open, onClose, type, getList, selectedData }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({});
  const [detailForm, setDetailForm] = useState({});
  const [step, setStep] = useState(0);

  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    setFormValue(cloneDeep(selectedData));
    if (open) {
      getRolesList({ list: '' }).then((res) => {
        if (res.code === 'SUCCESS') {
          setRoleList(res.data || []);
        }
      });
    }
  }, [selectedData]);

  // 接口成功后的操作
  const handleSuccess = (data) => {
    setDetailForm({ ...formValue, ...data });
    setStep(1);
    dispatch(
      setGlobalMessage({
        variant: 'success',
        msg: '操作成功！',
      })
    );
  };

  // 确认按钮触发事件
  const handleConfirm = () => {
    if (!formValue.name) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '请输入用户名！',
        })
      );
      return;
    }
    if (!formValue.phone || !(REG_TEL.test(formValue.phone))) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '请输入正确的手机号！',
        })
      );
      return;
    }
    if (!formValue.roleId) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '请选择角色！',
        })
      );
      return;
    }
    if (!formValue.org) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '请输入机构！',
        })
      );
      return;
    }
    if (!formValue.account) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '请输入登陆账号！',
        })
      );
      return;
    }
    if (type === 'add') {
      // 新增
      addUserAccount({ ...formValue }).then((res) => {
        if (res.code === 'SUCCESS') {
          handleSuccess(res.data || {});
        }
      });
    } else {
      // 编辑
      editUserAccount({ ...formValue, id: selectedData.id }).then((res) => {
        if (res.code === 'SUCCESS') {
          handleSuccess(res.data || {});
        }
      });
    }
  };

  // 复制账号密码
  const handleCopy = () => {
    getList();
  };

  // 关闭弹窗
  const handleClose = () => {
    onClose();
    // eslint-disable-next-line no-unused-expressions
    step === 1 && getList();
    setFormValue({});
    setStep(0);
  }

  const typeText = type === 'edit' ? '编辑' : '新增';
  const steps = [`${typeText}用户`, '生成账号密码'];
  const style = { width: '100%', marginRight: 20 };
  const alertStyle = {
    margin: '12px 24px 24px',
    backgroundColor: '#f2dea4',
    color: 'rgb(60 74 85)',
  };

  return (
    <Dialog sx={{ mx: 'auto' }} scroll="paper" maxWidth={1160} open={open}>
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 3 }}>
          <Typography variant="h6"> {typeText}用户 </Typography>
          <Iconify onClick={handleClose} icon={'eva:close-fill'} color={theme.palette.grey[800]} />
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Stepper alternativeLabel activeStep={step} connector={<QontoConnector />}>
          {
            steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
              </Step>
            ))
          }
        </Stepper>
        {
          step === 0 ? (
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                sx={{ py: 2, px: 3, width: 800 }}
              >
                <InputStyle
                  label="用户名"
                  style={style}
                  placeholder="请输入用户名"
                  value={formValue.name}
                  onChange={(e) => setFormValue({ ...formValue, name: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" />
                    ),
                  }}
                />
                <InputStyle
                  label="手机号"
                  style={{ width: '100%' }}
                  placeholder="请输入手机号"
                  value={formValue.phone}
                  onChange={(e) => setFormValue({ ...formValue, phone: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" />
                    ),
                  }}
                />
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                sx={{ py: 2, px: 3, width: 800 }}
              >
                <InputStyle
                  fullWidth
                  select
                  label="角色"
                  style={style}
                  placeholder="请选择角色"
                  value={formValue.roleId}
                  onChange={(e) => setFormValue({ ...formValue, roleId: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" />
                    ),
                  }}
                >
                  {
                    roleList.map((item, index) => <MenuItem key={index} value={item.id}>{item.name}</MenuItem>)
                  }
                </InputStyle>
                <InputStyle
                  label="机构"
                  style={{ width: '100%' }}
                  placeholder="请输入机构"
                  value={formValue.desc}
                  onChange={(e) => setFormValue({ ...formValue, org: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" />
                    ),
                  }}
                />

              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                sx={{ py: 2, px: 3, width: 800 }}
              >
                <InputStyle
                  label="登陆账号"
                  style={{ width: '100%' }}
                  placeholder="请输入登陆账号"
                  value={formValue.desc}
                  onChange={(e) => setFormValue({ ...formValue, account: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" />
                    ),
                  }}
                />

              </Stack>
              <Alert severity="warning" style={alertStyle}>注：（登陆账号主账号：用户名字 密码：手机号 例如登陆账号 GoPro：钉钉 密码：123456）</Alert>
            </Box>
          ) : (
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                sx={{ py: 2, px: 3, width: 800 }}
              >
                <InputStyle
                  disabled
                  label="用户角色"
                  style={style}
                  value={detailForm.roleName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" />
                    ),
                  }}
                />
                <InputStyle
                  disabled
                  label="账号"
                  style={style}
                  value={detailForm.account}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" />
                    ),
                  }}
                />
                <InputStyle
                  disabled
                  label="密码"
                  style={{ width: '100%' }}
                  value={detailForm.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" />
                    ),
                  }}
                />
              </Stack>
            </Box>
          )
        }
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          取消
        </Button>
        {
          step === 0 ? (
            <Button variant="contained" onClick={handleConfirm}>
              确认{typeText}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleCopy}>
              复制账号密码
            </Button>
          )
        }
      </DialogActions>
    </Dialog>
  );
}
