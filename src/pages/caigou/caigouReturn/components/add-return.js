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
import { ICON } from '../../../../config';
import GoodsItem from '../../../../components/goods-item';
import { textOverflow } from '../../../../assets/css/commonStyle';
import SizeItem from '../../../../components/size-item';
import { IconButtonAnimate } from '../../../../components/animate';
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import useToggle from '../../../../hooks/useToggle';
import Image from '../../../../components/Image';
import { fDataD100, fDataM100, fNumber } from '../../../../utils/formatNumber';
import {
  editCaiGou,
  getCaiGouOrderList,
  getCaiGouRuKuList,
  getShelfList,
  getStoreList,
  queryCaiGou,
  queryReturn,
  queryRuKu,
  returnAdd,
  returnEdit,
  ruKuAdd,
  ruKuEdit,
  saveCaiGou,
} from '../../../../services/caigou';
import { setGlobalMessage } from '../../../../redux/slices/global';
import { useDispatch } from '../../../../redux/store';
import RelatedOrderDialog from '../../caigouRuKu/components/related-order';
import { fTimestamp } from '../../../../utils/formatTime';
import { MODAL_TITLE } from '../../../../utils/options';
// ----------------------------------------------------------------------

AddReturnDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  getList: PropTypes.func,
  hideBtn: PropTypes.number,
  selectedData: PropTypes.object,
  setSelectedData: PropTypes.func,
};

export default function AddReturnDialog({ open, onClose, getList, hideBtn, selectedData, setSelectedData }) {
  const theme = useTheme();
  const grey = theme.palette.grey[500];

  const dispatch = useDispatch();
  const CaiGouForm = Yup.array().of(
    Yup.object().shape({
      num: Yup.number().required('???????????????'),
      storagePrice: Yup.number().required('???????????????'), // ????????????
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

  // ????????????????????????
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
      // ????????????
      queryRuKu(selectedOrder.id).then((r) => {
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
      selectedData.subOrderList.forEach((item) => {
        item.storagePrice = fDataD100(item.storagePrice);
        item.shelfOptions = [];
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
        msg: '???????????????',
      })
    );
  };
  const handleConfirm = () => {
    const c = _.cloneDeep(formValues.goodsArr);
    c.forEach((item) => {
      delete item.mapId;
      delete item.shelfOptions;
      if(hideBtn===1){
        item.inventorySubOrderId = item.id;
        delete item.id;
      }
      item.storagePrice = fDataM100(item.storagePrice);
    });

    if (hideBtn === 1) {
      // ??????
      returnAdd({
        notes,
        subOrderList: c,
        inventoryId: selectedData.id, // ??????????????????????????????id
        type: 0,
      }).then((r) => {
        handleSuccess();
      });
    } else {
      // ??????
      returnEdit({
        subOrderList: c,
        id: selectedData.id,
        inventoryId: selectedData.inventoryId,
        type: 0,
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

  // ?????????????????????
  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selectedRow = fields.map((n) => n.id);
      setSelectedRow(selectedRow);
      return;
    }
    setSelectedRow([]);
  };
  // ??????????????????????????????
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
  // ????????????
  const handleDelete = () => {
    const deleteProduct = fields.filter((item) => !selectedRow.includes(item.id));
    setSelectedRow([]);
    replace(deleteProduct);
  };
  // ???????????????
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
          <Typography variant="h6">{`${MODAL_TITLE[hideBtn - 1]}?????????`}</Typography>
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
            type="button"
            size="small"
            label="????????????"
            sx={{ width: 344 }}
            value={selectedData.id}
            placeholder="?????????????????????"
            onClick={onOpenRelated}
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
            label="????????????"
            sx={{ width: 344 }}
            placeholder="????????????"
            disabled
            value={hideBtn === 1 ? '??????????????????' : selectedData.purchaseOrderNo}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <DateTimePicker
            label="????????????"
            placeholder="?????????"
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

                  <TableCell width={80} align="center">
                    ????????????
                  </TableCell>
                  <TableCell width={120} align="left">
                    ?????????
                  </TableCell>
                  <TableCell width={120} align="left">
                    ??????
                  </TableCell>
                  <TableCell width={248} align="left">
                    ????????????
                  </TableCell>
                  <TableCell width={64} align="center">
                    ??????
                  </TableCell>

                  <TableCell width={80} align="center">
                    ??????
                  </TableCell>
                  <TableCell width={80} align="center">
                    ????????????
                  </TableCell>
                  <TableCell align="center">??????</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {fields.map((row, index) => {
                  const isItemSelected = selectedRow.indexOf(row.id) !== -1;

                  return (
                    <TableRow key={row.skuId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center" padding="checkbox">
                        <Checkbox checked={isItemSelected} onClick={() => handleClick(row)} />
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
                        {row.num}
                      </TableCell>
                      <TableCell width={80} align="center">
                        {row.storagePrice}
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
            placeholder="?????????????????????"
          />
          <Stack spacing={1} direction="column">
            <Stack spacing={3} direction="row" alignItems="center">
              <Typography color={theme.palette.grey[800]} variant="body1">
                ????????????
              </Typography>
              <Typography sx={{ textAlign: 'right' }} width={120} color={theme.palette.grey[800]} variant="body1">
                {_.uniqBy(formValues.goodsArr, 'articleUmber').length}
              </Typography>
            </Stack>
            <Stack spacing={3} direction="row" alignItems="center">
              <Typography color={theme.palette.grey[800]} variant="body1">
                ????????????
              </Typography>
              <Typography sx={{ textAlign: 'right' }} width={120} color={theme.palette.grey[800]} variant="body1">
                {_.sumBy(formValues.goodsArr, (o) => Number(o.num))}
              </Typography>
            </Stack>
            <Stack spacing={3} direction="row" alignItems="center">
              <Typography color={theme.palette.grey[800]} variant="h6">
                ????????????
              </Typography>
              <Typography
                sx={{ textAlign: 'right' }}
                style={{ ...textOverflow }}
                width={120}
                color={theme.palette.error.main}
                variant="h6"
              >
                ???{_.sumBy(formValues.goodsArr, (o) => Number(o.num * o.storagePrice))}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onCancel} variant="outlined">
          ??????
        </Button>
        {hideBtn !== 2 ? (
          <Button variant="contained" onClick={handleConfirm}>
            ??????
          </Button>
        ) : null}
      </DialogActions>
      {
        hideBtn===1&&<RelatedOrderDialog type={2} {...relatedProps} />
      }

    </Dialog>
  );
}
