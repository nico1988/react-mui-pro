import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

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
  DialogTitle,
  DialogContent,
  Checkbox,
} from '@mui/material';
import Paper from '@mui/material/Paper';
// components
import { useTheme } from '@mui/material/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import Iconify from '../../../../components/Iconify';
import { getCaiGouOrderList, getCaiGouRuKuList } from '../../../../services/caigou';
import { fDateTime } from '../../../../utils/formatTime';
import { fDataD100 } from '../../../../utils/formatNumber';
import { getKeyName } from '../../../../utils/util';
import { CHECK_STATUS_OPTIONS } from '../../../../utils/options';
import Label from '../../../../components/Label';
import { textOverflow } from '../../../../assets/css/commonStyle';
// ----------------------------------------------------------------------

const CHECK_STATUS_COLOR = ['error', 'success', 'info','info'];

RelatedOrderDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  setSelectedOrder: PropTypes.func,
  selectedOrder: PropTypes.object,
  type: PropTypes.number, // 关联类型
};

export default function RelatedOrderDialog({ open, onClose, setSelectedOrder, type }) {
  const theme = useTheme();
  const [total, setTotal] = useState(0);
  const [pagination, setP] = useState({
    pageIndex: 1,
    pageSize: 14,
  });
  const [list, setList] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const getOrderList = () => {
    if (type === 1) {
      getCaiGouOrderList({ ...pagination, auditStatus: 1 }).then((r) => {
        setList(r.data);
        setTotal(r.total);
      });
    } else {
      getCaiGouRuKuList({ ...pagination, status: 1 }).then((r) => {
        setList(r.data);
        setTotal(r.total);
      });
    }
  };
  useEffect(() => {
    getOrderList();
  }, [pagination]);
  // 处理每一行的选择事件
  const handleClick = (row) => {
    setSelectedRow(row.id === selectedRow.id ? {} : row);
  };
  const handleChangeRowsPerPage = (event) => {
    setP({
      pageIndex: 1,
      pageSize: parseInt(event.target.value, 10),
    });
  };
  const onConfirmSelected = () => {
    setSelectedOrder(selectedRow);
    onClose();
  };
  return (
    <Dialog sx={{ mx: 'auto' }} scroll="paper" maxWidth={1160} open={open}>
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 3 }}>
          <Typography variant="h6"> 选择关联订单 </Typography>
          <Iconify onClick={onClose} icon={'eva:close-fill'} color={theme.palette.grey[800]} />
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <TableContainer sx={{ height: 592, width: 1160 }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow sx={{ height: 32 }}>
                <TableCell align="center" padding="checkbox">
                  <Checkbox disabled />
                </TableCell>
                <TableCell width={184} align="left">
                  单据编号
                </TableCell>
                <TableCell width={328} align="left">
                  商品名称
                </TableCell>

                <TableCell width={184} align="left">
                  单据日期
                </TableCell>
                <TableCell width={120} align="center">
                  操作员
                </TableCell>
                <TableCell width={80} align="center">
                  金额
                </TableCell>
                <TableCell align="center">状态</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((row) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedRow.id === row.id} onClick={() => handleClick(row)} />
                    </TableCell>

                    <TableCell align="left">{type===1?row.purchaseOrderNo:row.inventoryNo}</TableCell>
                    <TableCell align="left">
                      <p style={{ ...textOverflow, width: 328 }}>{row.productName}</p>
                    </TableCell>
                    <TableCell align="left">{fDateTime(row.createDate)}</TableCell>
                    <TableCell align="center">{row.createUserName}</TableCell>
                    <TableCell align="center">{fDataD100(row.totalPrice)}</TableCell>
                    <TableCell align="center">
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={CHECK_STATUS_COLOR[row.status]}
                      >
                        {getKeyName(row.status, CHECK_STATUS_OPTIONS)}
                      </Label>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Divider />
          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={total}
            rowsPerPage={pagination.pageSize}
            page={pagination.pageIndex}
            onPageChange={(event, value) => setP({ ...pagination, pageIndex: value })}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          取消
        </Button>
        <Button variant="contained" onClick={onConfirmSelected}>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
