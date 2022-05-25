import PropTypes from 'prop-types';
// @mui
import {
  Dialog,
  ListItemButton,
  Stack,
  Typography,
  Button,
  DialogActions,
  Divider,
  InputAdornment,
  Card,
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  TableContainer,
  ListItemIcon,
  Box,
  ListItemText,
  IconButton,
  TablePagination,
  MenuItem,
} from '@mui/material';
import Paper from '@mui/material/Paper';
// components
import { useTheme } from '@mui/material/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import _ from 'lodash';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import InputStyle from '../../../../components/InputStyle';
import { getShelfList } from '../../../../services/caigou';
// ----------------------------------------------------------------------

BatchSetStoreDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  store: PropTypes.array,
  fields: PropTypes.array,
  replace: PropTypes.func,
  selectedRow: PropTypes.array,
};

export default function BatchSetStoreDialog({ open, onClose, store, fields, replace, selectedRow }) {
  const theme = useTheme();
  const [storeId, setStoreId] = useState(null);
  const [shelfId, setShelfId] = useState(null);
  const [shelfOptions, setOptions] = useState([]);
  const handleSelectStore = (v) => {
    setStoreId(v);
    getShelfList({ pageIndex: 1, pageSize: 999, id: v }).then((r) => {
      setOptions(r.data);
    });
  };
  const handleSetConfirm = () => {
    const n = _.cloneDeep(fields);
    n.forEach((item) => {
      if (selectedRow.includes(item.id)) {
        item.shelfOptions = shelfOptions;
        item.warehouseId = storeId;
        item.warehouseShelfId = shelfId;
      }
    });
    replace(n);
    onClose();
  };
  return (
    <Dialog sx={{ mx: 'auto' }} maxWidth={720} open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <Typography variant="h6"> 批量设置仓库 </Typography>
        <Iconify onClick={onClose} icon={'eva:close-fill'} color={theme.palette.grey[800]} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" sx={{ p: 3, width: 720 }}>
        <InputStyle
          label="仓库名称"
          fullWidth
          select
          placeholder="请选择"
          onChange={(e) => handleSelectStore(e.target.value)}
          value={storeId}
          SelectProps={{
            MenuProps: {
              sx: { '& .MuiPaper-root': { maxHeight: 260 } },
            },
          }}
          sx={{
            textTransform: 'capitalize',
          }}
        >
          {store.map((option) => (
            <MenuItem
              key={option.id}
              value={option.id}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {option.warehouseName}
            </MenuItem>
          ))}
        </InputStyle>
        <InputStyle
          label="货架设置"
          fullWidth
          select
          placeholder="请选择"
          onChange={(e) => setShelfId(e.target.value)}
          value={shelfId}
          SelectProps={{
            MenuProps: {
              sx: { '& .MuiPaper-root': { maxHeight: 260 } },
            },
          }}
          sx={{
            textTransform: 'capitalize',
          }}
        >
          {shelfOptions.map((option) => (
            <MenuItem
              key={option.id}
              value={option.id}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {option.shelves}
            </MenuItem>
          ))}
        </InputStyle>
      </Stack>
      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          取消
        </Button>
        <Button variant="contained" onClick={handleSetConfirm}>
          确认设置
        </Button>
      </DialogActions>
    </Dialog>
  );
}
