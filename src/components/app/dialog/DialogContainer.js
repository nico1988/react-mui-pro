import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Dialog,
  DialogActions,
  Divider,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// hook
import useLocales from 'src/hooks/useLocales';
// components
import Iconify from 'src/components/Iconify';
import { LoadingButton } from '@mui/lab';
// ----------------------------------------------------------------------

AppDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  showClose: PropTypes.bool, // 显示右上角的关闭按钮
  actions: PropTypes.array, // 右下角按钮, 显示的按钮数组, 支持 'cancel' / 'confirm'
  actionConfirm: PropTypes.object, // 确认按钮相关
  actionCancel: PropTypes.object, // 取消按钮相关
  sx: PropTypes.object,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

export default function AppDialog({ 
  open = false,
  title,
  showClose = false,
  children,
  actions,
  actionConfirm = {},
  actionCancel = {},
  onClose,
  sx = {},
}) {
  const theme = useTheme();
  const { getI18nText } = useLocales('components.app.dialog');

  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  const closeHandle = useCallback((callback) => {
    setVisible(false);
    if (callback) callback();
    if (onClose) onClose();
  }, [onClose]);

  return (
    <Dialog open={visible} fullWidth maxWidth="xl"
      sx={{ p: 0, m: 'auto', maxWidth: '90%', ...sx }} 
      PaperProps={{
        sx: {
          m: 0,
        }
      }}
      scroll="paper">
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 3 }}>
          <Typography variant="h6"> {title} </Typography>
          {showClose && <Iconify onClick={closeHandle} icon={'eva:close-fill'} color={theme.palette.grey[800]} />}
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {children}
      </DialogContent>
      {!!actions?.length && <>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          {actions.includes('cancel') &&
            <Button variant="outlined" sx={{
              width: 57,
              minWidth: 'auto',
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider 
            }} onClick={() => closeHandle(actionCancel.fn)} >
              {actionCancel.btnText || getI18nText('cancel', 'button')}
            </Button>}
          {actions.includes('confirm') &&
            <LoadingButton variant="contained" loading={actionConfirm.isSubmitting} onClick={actionConfirm.fn}>
              {actionConfirm.btnText || getI18nText('confirm', 'button')}
            </LoadingButton>}
        </DialogActions>
      </>}
    </Dialog>
  );
}
