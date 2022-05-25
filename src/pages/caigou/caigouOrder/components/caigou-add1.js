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
import { ICON } from '../../../../config';
import GoodsItem from '../../../../components/goods-item';
import { textOverflow } from '../../../../assets/css/commonStyle';
import SizeItem from '../../../../components/size-item';
import { IconButtonAnimate } from '../../../../components/animate';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import useToggle from '../../../../hooks/useToggle';
import AddCaiGou2Dialog from './caigou-add2';
import Image from '../../../../components/Image';
import { fDataD100, fDataM100, fNumber } from '../../../../utils/formatNumber';
import { barcodeSearch, editCaiGou, getGoodsList, saveCaiGou } from '../../../../services/caigou';
import { setGlobalMessage } from '../../../../redux/slices/global';
import { useDispatch } from '../../../../redux/store';
import { fDateTime, fTimestamp } from '../../../../utils/formatTime';
import {MODAL_TITLE} from "../../../../utils/options";
import useSettings from "../../../../hooks/useSettings";
// ----------------------------------------------------------------------

AddCaiGou1Dialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  getList: PropTypes.func,
  hideBtn: PropTypes.number,
  selectedData: PropTypes.object,
};

export default function AddCaiGou1Dialog({ open, onClose, getList, hideBtn, selectedData }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { themeStretch } = useSettings()
  // 采购2
  const { toggle: openAdd2, onOpen: onOpenAdd2, onClose: onCloseAdd2 } = useToggle();
  const [selected, setSelected] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [notes, setNotes] = useState('');
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
  useEffect(() => {
    if (selectedData.subOrderList) {
      selectedData.subOrderList.forEach((item) => {
        item.storagePrice = fDataD100(item.storagePrice);
      });
      replace(selectedData.subOrderList);
      setNotes(selectedData.notes||'');
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
  const caiGou2Props = {
    onClose: onCloseAdd2,
    setValueOuter: replace,
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
      delete item.id;
      item.storagePrice = fDataM100(item.storagePrice);
    });

    if (hideBtn === 1) {
      // 新增
      saveCaiGou({
        notes,
        subOrderList: c,
      }).then((r) => {
        handleSuccess();
      });
    } else {
      // 编辑
      editCaiGou({
        subOrderList: c,
        id: selectedData.id,
        purchaseOrderNo: selectedData.purchaseOrderNo,
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
      const selected = fields.map((n) => n.id);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };
  // 处理每一行的选择事件
  const handleClick = (row) => {
    const selectedIndex = selected.indexOf(row.id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row.id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };
  // 删除事件
  const handleDelete = () => {
    const deleteProduct = fields.filter((item) => !selected.includes(item.id));
    setSelected([]);
    replace(deleteProduct);
  };
  // 处理值改变
  const setFormValue = (row, index, keyName, value) => {
    const n = _.cloneDeep(row);
    n[keyName] = value;
    update(index, n);
  };
  const keyUp = (e) => {
    if (e.keyCode === 13) {
      barcodeSearch({ barcode }).then((r) => {
        const a = fields.findIndex((item) => item.barcode === barcode);
        if (a > -1) {
          update(a, {
            ...fields[a],
            num: fields[a].num + 1,
          });
        } else {
          let d = {
            ...r.data,
            num: 1,
            storagePrice: 0,
            totalMoney: 0,
            notes: '',
          };
          if (r.data.sizeList.length) {
            d = {
              ...d,
              ...r.data.sizeList[0],
            };
          }
          append(d);
        }
        setBarcode('');
      });
    }
  };
  return (
    <Dialog sx={{ mx: 'auto' }} scroll="paper" maxWidth={themeStretch ? false : 'lg'} open={open}>
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 3 }}>
          <Typography variant="h6">
            {`${MODAL_TITLE[hideBtn-1]}采购订单`}
          </Typography>
          <Iconify onClick={onClose} icon={'eva:close-fill'} color={theme.palette.grey[800]} />
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={4}
          justifyContent="flex-start"
          sx={{ py: 2, px: 3, width: 1160 }}
        >
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
        <Stack
          direction="row"
          alignItems="center"
          spacing={4}
          justifyContent="space-between"
          sx={{ py: 2, px: 3, width: 1160 }}
        >
          <Stack direction="row" alignItems="center" spacing={3} justifyContent="flex-start">
            <Button onClick={onOpenAdd2} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              快速入库
            </Button>
            <InputStyle
              disabled={hideBtn === 2}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyUp={keyUp}
              value={barcode}
              size="small"
              sx={{ width: '264px' }}
              placeholder="请扫码商品条码并回车"
            />
          </Stack>
          <Button
            disabled={!selected.length}
            onClick={handleDelete}
            variant="contained"
            startIcon={<Iconify icon="ep:delete" />}
          >
            删除
          </Button>
        </Stack>

        <TableContainer sx={{ minHeight: 424, width: 1160 }} component={Paper}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < fields.length}
                      checked={fields.length > 0 && selected.length === fields.length}
                      onChange={(e) => handleSelectAllClick(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell align="left">条形码</TableCell>
                  <TableCell align="center">商品图片</TableCell>
                  <TableCell align="center">商品名称</TableCell>
                  <TableCell align="center">尺码</TableCell>
                  <TableCell align="center">货号</TableCell>
                  <TableCell align="center">数量</TableCell>
                  <TableCell align="center">入库单价</TableCell>
                  <TableCell align="center">总价</TableCell>

                  <TableCell align="center">备注</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {fields.map((row, index) => {
                  const isItemSelected = selected.indexOf(row.id) !== -1;

                  return (
                    <TableRow key={row.skuId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onClick={() => handleClick(row)} />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.barcode}
                      </TableCell>
                      <TableCell align="center">
                        <Image
                          src={row?.spuLogo}
                          style={{ objectFit: 'contain' }}
                          disabledEffect
                          sx={{ width: 55, height: 55 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <p style={{ ...textOverflow, width: 248 }}>{row.title}</p>
                      </TableCell>
                      <TableCell align="center">{row.size}</TableCell>
                      <TableCell align="center">{row.articleNumber}</TableCell>
                      <TableCell align="center">
                        <RHFTextField
                          disabled={hideBtn === 2}
                          onChange={(e) => setFormValue(row, index, 'num', e.target.value)}
                          value={formValues.goodsArr[index].num}
                          style={{ textAlign: 'center', lineHeight: 30 }}
                          size="small"
                          name={`goodsArr[${index}].num`}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <RHFTextField
                          onChange={(e) => setFormValue(row, index, 'storagePrice', e.target.value)}
                          disabled={hideBtn === 2}
                          value={formValues.goodsArr[index].storagePrice}
                          size="small"
                          name={`goodsArr[${index}].storagePrice`}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {Number(formValues.goodsArr[index].num) * Number(formValues.goodsArr[index].storagePrice)}
                      </TableCell>

                      <TableCell align="center">
                        <RHFTextField
                          onChange={(e) => setFormValue(row, index, 'notes', e.target.value)}
                          disabled={hideBtn === 2}
                          value={formValues.goodsArr[index].notes}
                          size="small"
                          name={`goodsArr[${index}].notes`}
                          sx={{ width: 80 }}
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
      <AddCaiGou2Dialog {...caiGou2Props} open={openAdd2} />
    </Dialog>
  );
}
