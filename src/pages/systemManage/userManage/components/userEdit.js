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

  // ????????????????????????
  const handleSuccess = (data) => {
    setDetailForm({ ...formValue, ...data });
    setStep(1);
    dispatch(
      setGlobalMessage({
        variant: 'success',
        msg: '???????????????',
      })
    );
  };

  // ????????????????????????
  const handleConfirm = () => {
    if (!formValue.name) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '?????????????????????',
        })
      );
      return;
    }
    if (!formValue.phone || !(REG_TEL.test(formValue.phone))) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '??????????????????????????????',
        })
      );
      return;
    }
    if (!formValue.roleId) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '??????????????????',
        })
      );
      return;
    }
    if (!formValue.org) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '??????????????????',
        })
      );
      return;
    }
    if (!formValue.account) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '????????????????????????',
        })
      );
      return;
    }
    if (type === 'add') {
      // ??????
      addUserAccount({ ...formValue }).then((res) => {
        if (res.code === 'SUCCESS') {
          handleSuccess(res.data || {});
        }
      });
    } else {
      // ??????
      editUserAccount({ ...formValue, id: selectedData.id }).then((res) => {
        if (res.code === 'SUCCESS') {
          handleSuccess(res.data || {});
        }
      });
    }
  };

  // ??????????????????
  const handleCopy = () => {
    getList();
  };

  // ????????????
  const handleClose = () => {
    onClose();
    // eslint-disable-next-line no-unused-expressions
    step === 1 && getList();
    setFormValue({});
    setStep(0);
  }

  const typeText = type === 'edit' ? '??????' : '??????';
  const steps = [`${typeText}??????`, '??????????????????'];
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
          <Typography variant="h6"> {typeText}?????? </Typography>
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
                  label="?????????"
                  style={style}
                  placeholder="??????????????????"
                  value={formValue.name}
                  onChange={(e) => setFormValue({ ...formValue, name: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" />
                    ),
                  }}
                />
                <InputStyle
                  label="?????????"
                  style={{ width: '100%' }}
                  placeholder="??????????????????"
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
                  label="??????"
                  style={style}
                  placeholder="???????????????"
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
                  label="??????"
                  style={{ width: '100%' }}
                  placeholder="???????????????"
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
                  label="????????????"
                  style={{ width: '100%' }}
                  placeholder="?????????????????????"
                  value={formValue.desc}
                  onChange={(e) => setFormValue({ ...formValue, account: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" />
                    ),
                  }}
                />

              </Stack>
              <Alert severity="warning" style={alertStyle}>????????????????????????????????????????????? ?????????????????? ?????????????????? GoPro????????? ?????????123456???</Alert>
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
                  label="????????????"
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
                  label="??????"
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
                  label="??????"
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
          ??????
        </Button>
        {
          step === 0 ? (
            <Button variant="contained" onClick={handleConfirm}>
              ??????{typeText}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleCopy}>
              ??????????????????
            </Button>
          )
        }
      </DialogActions>
    </Dialog>
  );
}
