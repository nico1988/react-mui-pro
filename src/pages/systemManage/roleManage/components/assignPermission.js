import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  Dialog,
  Stack,
  FormGroup,
  FormControlLabel,
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
import Iconify from '../../../../components/Iconify';
import { setGlobalMessage } from '../../../../redux/slices/global';
import { useDispatch } from '../../../../redux/store';
import { getRolesMenus, editRolesMenus, getMenusData } from '../../../../services/roles';

AssignPermissionDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  getList: PropTypes.func,
  selectedData: PropTypes.object,
};

export default function AssignPermissionDialog({ open, onClose, getList, selectedData }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [menusList, setMenusList] = useState([
    // {
    //   id: 1,
    //   name: '采购管理',
    // },
    // {
    //   id: 2,
    //   name: '零售管理',
    // },
    // {
    //   id: 3,
    //   name: '零售管理',
    // },
    // {
    //   id: 4,
    //   name: '零售管理',
    // },
    // {
    //   id: 5,
    //   name: '零售管理',
    // },
    // {
    //   id: 6,
    //   name: '零售管理',
    // },
    // {
    //   id: 7,
    //   name: '零售管理',
    // },
    // {
    //   id: 8,
    //   name: '零售管理',
    // },
  ]);
  const [permissionList, setPermissionList] = useState([]);

  useEffect(() => {
    if (open) {
      getMenusData(0).then((res) => {
        if (res.code === 'SUCCESS') {
          setMenusList(res.data || []);
          getPermissionData(selectedData.id);
        }
      });
    }
  }, [selectedData]);

  // 获取权限数据接口
  const getPermissionData = (id) => {
    getRolesMenus(id).then((res) => {
      if (res.code === 'SUCCESS') {
        setPermissionList(res.data || []);
      }
    });
  };

  // 勾选事件
  const handleChange = (checked, record) => {
    let data = [];
    if (checked) {
      data = [...permissionList, { menuId: record.id }];
    } else {
      data = permissionList.filter(item => item.menuId !== record.id);
    }
    setPermissionList(data);
  };

  // 确认按钮触发事件
  const handleConfirm = () => {
    editRolesMenus({ id: selectedData.id, menus: permissionList }).then((res) => {
      if (res.code === 'SUCCESS') {
        onClose();
        getList();
        dispatch(
          setGlobalMessage({
            variant: 'success',
            msg: '操作成功！',
          })
        );
      } else {
        dispatch(
          setGlobalMessage({
            variant: 'error',
            msg: res.message || '操作失败！',
          })
        );
      }
      
    });
  };

  return (
    <Dialog sx={{ mx: 'auto' }} scroll="paper" maxWidth={1160} open={open}>
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 3 }}>
          <Typography variant="h6"> 分配权限 </Typography>
          <Iconify onClick={onClose} icon={'eva:close-fill'} color={theme.palette.grey[800]} />
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
      <Stack 
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="flex-start"
        sx={{ py: 2, px: 3, width: 800 }}
       >
        <FormGroup style={{ flexDirection: 'row', width: '100%' }}>
          {
            menusList.length !== 0 && menusList.map((item ,index) => (
              <FormControlLabel  
                style={{ minWidth: '18%', marginBottom: 24, marginRight: 16 }}
                key={index}
                control={
                  <Switch 
                    checked={permissionList.some(k => k.menuId === item.id)}
                    onChange={(event) => handleChange(event.target.checked, item)}
                  />
                }
                label={item.name}
              />
            ))
          }
          {
            menusList.length === 0 && <div style={{ width: '100%', textAlign: 'center', padding: '10px' }}>暂无数据</div> 
          }
        </FormGroup>
      </Stack>
      
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          取消
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          确认分配
        </Button>
      </DialogActions>
    </Dialog>
  );
}
