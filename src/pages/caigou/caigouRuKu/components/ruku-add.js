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
  TextField,
  Checkbox,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import Paper from '@mui/material/Paper';
// components

import { useTheme } from '@mui/material/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import { DateTimePicker } from '@mui/lab';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import InputStyle from '../../../../components/InputStyle';
import { textOverflow } from '../../../../assets/css/commonStyle';
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import useToggle from '../../../../hooks/useToggle';
import Image from '../../../../components/Image';
import { fDataD100, fDataM100, fNumber } from '../../../../utils/formatNumber';
import { getShelfList, getStoreList, queryCaiGou, ruKuAdd, ruKuEdit } from '../../../../services/caigou';
import { setGlobalMessage } from '../../../../redux/slices/global';
import { useDispatch } from '../../../../redux/store';
import RelatedOrderDialog from './related-order';
import BatchSetStoreDialog from './batch-set-store';
import { fTimestamp } from '../../../../utils/formatTime';
import { MODAL_TITLE } from '../../../../utils/options';
// ----------------------------------------------------------------------

AddRuKuDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  getList: PropTypes.func,
  hideBtn: PropTypes.number,
  selectedData: PropTypes.object,
  setSelectedData: PropTypes.func,
};

export default function AddRuKuDialog({ open, onClose, getList, hideBtn, selectedData, setSelectedData }) {
  const theme = useTheme();

  const dispatch = useDispatch();
  const CaiGouForm = Yup.array().of(
    Yup.object().shape({
      num: Yup.number().required('请填写数量'),
      storagePrice: Yup.number().required('请填写价格'), // 入库单价
    })
  );
  const defaultValues = {
    goodsArr: [],
  };

  const methods = useForm({
    resolver: yupResolver(CaiGouForm),
    defaultValues,
  });
  const { register, control, handleSubmit, reset, watch, setValue } = methods;
  const formValues = watch();
  const { fields, append, update, replace } = useFieldArray({
    control,
    keyName: 'mapId',
    name: 'goodsArr',
  });

  // 批量设置仓库弹窗
  const { toggle: openBatchSet, onOpen: onOpenBatchSet, onClose: onCloseBatchSet } = useToggle();
  const { toggle: openRelated, onOpen: onOpenRelated, onClose: onCloseRelated } = useToggle();

  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});

  const [notes, setNotes] = useState('');
  const [store, setStoreList] = useState([]);

  const getStore = () => {
    getStoreList({ pageIndex: 1, pageSize: 999 }).then((r) => {
      setStoreList(r.data);
    });
  };

  useEffect(() => {
    if (selectedOrder.id) {
      queryCaiGou(selectedOrder.id).then((r) => {
        setSelectedData(r.data);
      });
    } else {
      setSelectedData({});
    }
  }, [selectedOrder]);
  useEffect(() => {
    getStore();
  }, []);

  useEffect(() => {
    if (selectedData.subOrderList) {
      const arr=[];
      selectedData.subOrderList.forEach(async (item) => {
        item.storagePrice = fDataD100(item.storagePrice);
        if (hideBtn === 1) {
          // 新增
          item.shelfOptions = [];
          item.warehouseShelfId = '';
          item.warehouseId = '';
        } else if (item.warehouseId) {
          item.shelfOptions = [];
          // 查看和编辑
          // try {
          //   const r = await getShelfList({ pageIndex: 1, pageSize: 999, id: item.warehouseId });
          //   item.shelfOptions = r.data;
          // } catch (e) {
          //   console.log(e);
          //
          // }
        } else {
          item.shelfOptions = [];
        }
      });
      replace(selectedData.subOrderList);
      setNotes(selectedData.notes || '');
    } else {
      replace([]);
      setNotes('');
    }
  }, [selectedData]);
  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuccess = () => {
    onClose();
    replace([]);
    setNotes('');
    getList();
    dispatch(
      setGlobalMessage({
        variant: 'success',
        msg: '操作成功！',
      })
    );
  };
  const handleConfirm = () => {
    const c = _.cloneDeep(formValues.goodsArr);
    c.forEach((item) => {
      delete item.mapId;
      delete item.shelfOptions;
      if (hideBtn === 1) {
        item.purchaseSubOrderId = item.id;
        delete item.id;
      }
      item.storagePrice = fDataM100(item.storagePrice);
    });
    if (hideBtn === 1) {
      // 新增
      ruKuAdd({
        notes,
        purchaseOrderId: selectedData.id, // 新增是关联订单的id
        subOrderList: c,
      }).then((r) => {
        handleSuccess();
      });
    } else {
      // 编辑
      ruKuEdit({
        subOrderList: c,
        id: selectedData.id,
        purchaseOrderNo: selectedData.purchaseOrderNo,
        purchaseOrderId: selectedData.purchaseOrderId,
      }).then((r) => {
        handleSuccess();
      });
    }
  };
  const onCancel = () => {
    replace([]);
    setNotes('');
    onClose();
  };

  // 处理全选或反选
  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selectedRow = fields.map((n) => n.id);
      setSelectedRow(selectedRow);
      return;
    }
    setSelectedRow([]);
  };
  // 处理每一行的选择事件
  const handleClick = (row) => {
    const selectedIndex = selectedRow.indexOf(row.id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRow, row.id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRow.slice(1));
    } else if (selectedIndex === selectedRow.length - 1) {
      newSelected = newSelected.concat(selectedRow.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedRow.slice(0, selectedIndex), selectedRow.slice(selectedIndex + 1));
    }
    setSelectedRow(newSelected);
  };
  // 删除事件
  const handleDelete = () => {
    const deleteProduct = fields.filter((item) => !selectedRow.includes(item.id));
    setSelectedRow([]);
    replace(deleteProduct);
  };
  // 处理值改变
  const setFormValue = (row, index, keyName, value) => {
    const n = _.cloneDeep(row);
    n[keyName] = value;
    if (keyName === 'warehouseId') {
      getShelfList({ pageIndex: 1, pageSize: 999, id: value }).then((r) => {
        n.shelfOptions = r.data;
        update(index, n);
      });
    } else {
      update(index, n);
    }
  };
  const batchProps = {
    onClose: onCloseBatchSet,
    open: openBatchSet,
    store,
    fields,
    replace,
    selectedRow,
  };
  const relatedProps = {
    onClose: onCloseRelated,
    open: openRelated,
    setSelectedOrder,
    selectedOrder,
  };
  return (
    <Dialog sx={{ p: 0 }} sx={{ m: 'auto' }} scroll="paper" maxWidth={1160} open={open}>
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 3 }}>
          <Typography variant="h6">{`${MODAL_TITLE[hideBtn - 1]}入库单`}</Typography>
          <Iconify onClick={onClose} icon={'eva:close-fill'} color={theme.palette.grey[800]} />
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {hideBtn === 1 ? (
          <>
            <Stack
              direction="row"
              alignItems="center"
              spacing={4}
              justifyContent="flex-start"
              sx={{ py: 2, px: 3, width: 1160 }}
            >
              <InputStyle
                type="button"
                size="small"
                label="关联订单"
                sx={{ width: 344 }}
                placeholder="请输入关联订单"
                onClick={onOpenRelated}
                value={selectedData.id}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <InputStyle
                size="small"
                label="单据编号"
                sx={{ width: 344 }}
                placeholder="单据编号"
                disabled
                value={hideBtn === 1 ? '系统自动生成' : selectedData.purchaseOrderNo}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <DateTimePicker
                label="单据日期"
                placeholder="请选择"
                disabled
                inputFormat="yyyy-MM-dd HH:mm:ss"
                value={hideBtn === 1 ? new Date() : fTimestamp(selectedData.createDate)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    sx={{
                      width: 344,
                    }}
                  />
                )}
              />
            </Stack>
            <Box sx={{ py: '22px', px: 3 }}>
              <Button disabled={!selectedRow.length} onClick={onOpenBatchSet} variant="contained">
                批量设置仓库货架
              </Button>
            </Box>
          </>
        ) : null}

        <TableContainer sx={{ minHeight: 368, width: 1160 }} component={Paper}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" padding="checkbox">
                    <Checkbox
                      indeterminate={selectedRow.length > 0 && selectedRow.length < fields.length}
                      checked={fields.length > 0 && selectedRow.length === fields.length}
                      onChange={(e) => handleSelectAllClick(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell width={96} align="center">
                    仓库名称
                  </TableCell>
                  <TableCell width={80} align="center">
                    货架
                  </TableCell>
                  <TableCell width={80} align="center">
                    商品图片
                  </TableCell>
                  <TableCell width={120} align="left">
                    条形码
                  </TableCell>
                  <TableCell width={120} align="left">
                    货号
                  </TableCell>
                  <TableCell width={248} align="left">
                    商品名称
                  </TableCell>
                  <TableCell width={64} align="center">
                    尺码
                  </TableCell>

                  <TableCell width={80} align="center">
                    数量
                  </TableCell>
                  <TableCell width={80} align="center">
                    入库单价
                  </TableCell>
                  <TableCell align="center">备注</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {fields.map((row, index) => {
                  const isItemSelected = selectedRow.indexOf(row.id) !== -1;

                  return (
                    <TableRow key={row.skuId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onClick={() => handleClick(row)} />
                      </TableCell>

                      <TableCell align="center">
                        <RHFSelect
                          name={`goodsArr[${index}].warehouseId`}
                          onChange={(e) => setFormValue(row, index, 'warehouseId', e.target.value)}
                          value={formValues.goodsArr[index].warehouseId}
                          size="small"
                          sx={{ width: 84 }}
                        >
                          <option style={{ display: 'none' }} key={-1} value={''} />
                          {store.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.warehouseName}
                            </option>
                          ))}
                        </RHFSelect>
                      </TableCell>
                      <TableCell width={80} align="center">
                        <RHFSelect
                          name={`goodsArr[${index}].warehouseShelfId`}
                          onChange={(e) => setFormValue(row, index, 'warehouseShelfId', e.target.value)}
                          value={formValues.goodsArr[index].warehouseShelfId}
                          size="small"
                          sx={{ width: 62 }}
                        >
                          <option style={{ display: 'none' }} key={-1} value={''} />
                          {row.shelfOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.shelves}
                            </option>
                          ))}
                        </RHFSelect>
                      </TableCell>
                      <TableCell width={80} align="center">
                        <Image
                          src={row?.spuLogo}
                          style={{ objectFit: 'contain' }}
                          disabledEffect
                          sx={{ width: 40, height: 40 }}
                        />
                      </TableCell>
                      <TableCell width={120} align="center">
                        {row.barcode}
                      </TableCell>
                      <TableCell width={120} align="center">
                        {row.articleNumber}
                      </TableCell>
                      <TableCell width={248} align="left">
                        <p style={{ ...textOverflow, width: 248 }}>{row.title}</p>
                      </TableCell>
                      <TableCell width={64} align="center">
                        {row.size}
                      </TableCell>

                      <TableCell width={64} align="center">
                        <RHFTextField
                          disabled={hideBtn === 2}
                          name={`goodsArr[${index}].num`}
                          onChange={(e) => setFormValue(row, index, 'num', e.target.value)}
                          value={formValues.goodsArr[index].num}
                          size="small"
                          style={{ textAlign: 'center', lineHeight: 30 }}
                          sx={{ width: 64 }}
                        />
                      </TableCell>
                      <TableCell width={80} align="center">
                        <RHFTextField
                          onChange={(e) => setFormValue(row, index, 'storagePrice', e.target.value)}
                          disabled={hideBtn === 2}
                          value={formValues.goodsArr[index].storagePrice}
                          size="small"
                          name={`goodsArr[${index}].storagePrice`}
                          sx={{ width: 64 }}
                        />
                      </TableCell>

                      <TableCell sx={{ px: 0 }} width={80} align="center">
                        <RHFTextField
                          onChange={(e) => setFormValue(row, index, 'notes', e.target.value)}
                          disabled={hideBtn === 2}
                          value={formValues.goodsArr[index].notes}
                          size="small"
                          name={`goodsArr[${index}].notes`}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </FormProvider>
        </TableContainer>
        <Divider />
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{ py: 2, px: 3, width: 1160 }}
        >
          <InputStyle
            disabled={hideBtn !== 1}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            maxRows={3}
            variant="filled"
            sx={{ width: 356, height: 92 }}
            placeholder="请输入单据名称"
          />
          <Stack spacing={1} direction="column">
            <Stack spacing={3} direction="row" alignItems="center">
              <Typography color={theme.palette.grey[800]} variant="body1">
                商品种类
              </Typography>
              <Typography sx={{ textAlign: 'right' }} width={120} color={theme.palette.grey[800]} variant="body1">
                {_.uniqBy(formValues.goodsArr, 'articleUmber').length}
              </Typography>
            </Stack>
            <Stack spacing={3} direction="row" alignItems="center">
              <Typography color={theme.palette.grey[800]} variant="body1">
                商品数量
              </Typography>
              <Typography sx={{ textAlign: 'right' }} width={120} color={theme.palette.grey[800]} variant="body1">
                {_.sumBy(formValues.goodsArr, (o) => Number(o.num))}
              </Typography>
            </Stack>
            <Stack spacing={3} direction="row" alignItems="center">
              <Typography color={theme.palette.grey[800]} variant="h6">
                采购金额
              </Typography>
              <Typography
                sx={{ textAlign: 'right' }}
                style={{ ...textOverflow }}
                width={120}
                color={theme.palette.error.main}
                variant="h6"
              >
                ￥{_.sumBy(formValues.goodsArr, (o) => Number(o.num * o.storagePrice))}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onCancel} variant="outlined">
          取消
        </Button>
        {hideBtn !== 2 ? (
          <Button variant="contained" onClick={handleConfirm}>
            确定
          </Button>
        ) : null}
      </DialogActions>
      <BatchSetStoreDialog {...batchProps} />
      {hideBtn === 1 && <RelatedOrderDialog type={1} {...relatedProps} />}
    </Dialog>
  );
}
