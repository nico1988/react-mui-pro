import PropTypes from 'prop-types';
// @mui
import {
  InputAdornment,
  Dialog,
  Stack,
  Typography,
  Button,
  DialogActions,
  Divider,
  DialogTitle,
  DialogContent,
} from '@mui/material';
// components

import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';
import { setGlobalMessage } from '../../../../redux/slices/global';
import { useDispatch } from '../../../../redux/store';
import { addRoles, editRoles } from '../../../../services/roles';

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

  const [formValue, setFormValue] = useState({ name: '', desc: '' });

  useEffect(() => {

    setFormValue(cloneDeep({
      name: selectedData.name,
      desc: selectedData.desc,
    }))
  }, [selectedData]);
 
  // 接口成功后的操作
  const handleSuccess = () => {
    onClose();
    getList();
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
          msg: '请输入角色名称！',
        })
      );
      return ;
    }
    if (!formValue.desc) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '请输入描述信息！',
        })
      );
      return ;
    }
    if (type === 'add') {
      // 新增
      addRoles({ ...formValue }).then(() => {
        handleSuccess();
      });
    } else {
      // 编辑
      editRoles({...formValue, id: selectedData.id }).then(() => {
        handleSuccess();
      });
    }
  };
  const typeText = type === 'edit' ? '编辑' : '新增';

  return (
    <Dialog sx={{ mx: 'auto' }} scroll="paper" maxWidth={1160} open={open}>
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 3 }}>
          <Typography variant="h6"> {typeText}角色 </Typography>
          <Iconify onClick={onClose} icon={'eva:close-fill'} color={theme.palette.grey[800]} />
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          sx={{ py: 2, px: 3, width: 800 }}
        >
          <InputStyle
            label="角色名称"
            style={{ width: '100%' }}
            placeholder="请输入角色名称"
            value={formValue.name}
            onChange={(e) => setFormValue({ ...formValue, name: e.target.value })}
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
            label="描述"
            style={{ width: '100%' }}
            placeholder="请输入描述"
            value={formValue.desc}
            onChange={(e) => setFormValue({ ...formValue, desc: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" />
              ),
            }}
          />

        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          取消
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          确认{typeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
