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
  DialogTitle,
  DialogContent,
} from '@mui/material';
import Paper from '@mui/material/Paper';
// components
import { useTheme } from '@mui/material/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import _ from 'lodash';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import InputStyle from '../../../../components/InputStyle';
import { ICON } from '../../../../config';
import GoodsItem from '../../../../components/goods-item';
import { textOverflow } from '../../../../assets/css/commonStyle';
import SizeItem from '../../../../components/size-item';
import { IconButtonAnimate } from '../../../../components/animate';
import { getGoodsList } from '../../../../services/caigou';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import { fNumber } from '../../../../utils/formatNumber';
import Image from '../../../../components/Image';
import emptyImg from '../../../../assets/images/icon/searchEmpty.png'
// ----------------------------------------------------------------------

AddCaiGou2Dialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.func,
  setValueOuter: PropTypes.func,
};

export default function AddCaiGou2Dialog({ open, onClose, setValueOuter }) {
  const theme = useTheme();
  const [goodsList, setGoods] = useState([]);
  const [articleNumber, setArticleNumber] = useState('');
  const [selectedGoods, setSelectedGoods] = useState({});
  const [sizeList, setSizeList] = useState([]);
  const [num, setNum] = useState('');
  const [price, setPrice] = useState('');
  const CaiGouForm = Yup.object().shape({
    num: Yup.number().required('请填写数量'),
    storagePrice: Yup.number().required('请填写价格'), // 入库单价
  });

  const defaultValues = {
    goodsArr: [],
  };

  const methods = useForm({
    resolver: yupResolver(CaiGouForm),
    defaultValues,
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const formValues = watch();
  const { fields, append, remove, replace, update } = useFieldArray({
    control,
    keyName: 'mapId',
    name: 'goodsArr',
  });

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
    } catch (error) {
      console.error(error);
    }
  };
  const getGoods = () => {
    getGoodsList({ articleNumber }).then((r) => {
      setGoods(r.data);
    });
  };

  const handleSize = (skuId) => {
    const size = _.cloneDeep(sizeList);
    size.forEach((item) => {
      if (item.skuId === skuId) {
        item.isSelected = !item.isSelected;
      }
    });
    setSizeList(size);
  };
  useEffect(() => {
    if (!selectedGoods.sizeList) return;
    const size = _.cloneDeep(selectedGoods.sizeList);
    size.forEach((item) => {
      item.isSelected = false; // 初始化
    });
    setSizeList(size);
  }, [selectedGoods]);
  const onClickSize = (i) => {
    handleSize(i.skuId);
    const index = fields.findIndex((item) => item.skuId === i.skuId);
    const s = _.cloneDeep(selectedGoods);
    delete s.sizeList;
    if (index > -1) {
      remove(index);
    } else {
      append({
        ...i,
        ...s,
        num: 1,
        storagePrice: 0,
        totalMoney: 0,
        notes: '',
      });
    }
  };
  // 批量输入
  const onBatchInput = () => {
    const s = _.cloneDeep(fields);
    s.forEach((item) => {
      if (num !== '') {
        item.num = Number(num);
      }
      if (price !== '') {
        item.storagePrice = Number(price);
      }
      item.totalMoney = Number(item.num * item.storagePrice);
    });
    replace(s);
  };

  const handleRemove = (row, index) => {
    remove(index);
    handleSize(row.skuId);
  };
  const handleConfirm = async () => {
    setValueOuter(fields);
    onClose();
  };
  const onSearchGoods = (e) => {
    setArticleNumber(e.target.value);
  };
  const changeSelectedGoods = (item) => {
    setSelectedGoods(item);
    replace([]);
  };
  const keyUp = (e) => {
    if (e.keyCode === 13) {
      getGoods();
    }
  };
  // 处理值改变
  const setFormValue = (row, index, keyName, value) => {
    const n = _.cloneDeep(row);
    n[keyName] = value;
    update(index, n);
  };

  const handleError = (error) => {
    console.log(error);

  };
  return (
    <Dialog scroll="paper" disableEscapeKeyDown sx={{ mx: 'auto' }} maxWidth={1208} open={open}>
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 3 }}>
          <Typography variant="h6"> 快速入库 </Typography>
          <Iconify onClick={onClose} icon={'eva:close-fill'} color={theme.palette.grey[800]} />
        </Stack>
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ px: 2, py: 3 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={3}>
          <Card
            sx={{
              width: 400,
              height: 688,
              px: 2,
              py: 3,
            }}
          >
            <InputStyle
              fullWidth
              placeholder="请输入采购商品货号"
              onChange={onSearchGoods}
              onKeyUp={keyUp}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            {goodsList.length ? (
              <Stack direction="column">
                {goodsList.map((item, index) => (
                  <GoodsItem
                    setSelectedGoods={() => changeSelectedGoods(item)}
                    item={item}
                    isSelected={selectedGoods.id === item.id}
                    key={item.id}
                  />
                ))}
              </Stack>
            ) : (
              <Stack sx={{pt:'144px'}} direction="column" justifyContent="center" alignItems="center">
                <Image src={emptyImg} style={{objectFit:'contain'}} disabledEffect sx={{  width: 200, height: 200,  }} />
                <Typography sx={{  mt: 2, }} color={theme.palette.grey[600]} variant="body2">
                  暂未搜到商品信息~
                </Typography>
              </Stack>
            )}
          </Card>

          <Card
            sx={{
              width: 744,
              px: 1,
            }}
          >
            {Object.keys(selectedGoods).length ? (
              <>
                <GoodsItem item={selectedGoods} isSelected={false} />
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography sx={{ ml: '8px' }} color={theme.palette.grey[800]} variant="subtitle2">
                    采购商品尺码
                  </Typography>
                  <Typography color={theme.palette.grey[500]} variant="caption">
                    点击下方尺码选中入库 （尺码不全？点击
                    <Typography color={theme.palette.primary.main} variant="caption">
                      更新
                    </Typography>
                    试试）
                  </Typography>
                </Stack>
                <Box sx={{ mt: '8px', ml: '8px', display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                  {sizeList.map((item, index) => (
                    <SizeItem onClick={() => onClickSize(item)} key={item.skuId} size={item} />
                  ))}
                </Box>
                <Stack justifyContent="space-between" direction="row" sx={{ mt: '36px', mx: '24px' }}>
                  <Stack spacing="26px" alignItems="center" justifyContent="flex-start" direction="row">
                    <Stack alignItems="center" justifyContent="flex-start" direction="row" spacing={2}>
                      <Iconify icon={'healthicons:money-bag-outline'} width={24} height={24} />
                      <Typography sx={{ ml: '10px', mr: '6px' }} color={theme.palette.grey[600]} variant="subtitle2">
                        批量填写价格
                      </Typography>
                      <InputStyle
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        size="small"
                        style={{width: 64 }}
                      />
                    </Stack>
                    <Stack alignItems="center" justifyContent="flex-start" direction="row" spacing={2}>
                      <Iconify icon={'ci:bar-chart-circle'} width={24} height={24} />
                      <Typography sx={{ ml: '10px', mr: '6px' }} color={theme.palette.grey[600]} variant="subtitle2">
                        批量填写数量
                      </Typography>
                      <InputStyle
                        value={num}
                        onChange={(e) => setNum(e.target.value)}
                        type="number"
                        size="small"
                        style={{ width: 64 }}
                      />
                    </Stack>
                    <IconButtonAnimate sx={{ borderRadius: '8px' }} size="small">
                      <Iconify icon={'ep:delete'} width={24} height={24} />
                      <Typography sx={{ ml: '10px' }} color={theme.palette.grey[600]} variant="subtitle2">
                        全部删除
                      </Typography>
                    </IconButtonAnimate>
                  </Stack>
                  <Button onClick={onBatchInput} variant="outlined">
                    确认批量填写
                  </Button>
                </Stack>
                <TableContainer sx={{ width: 736, mt: '28px', minHeight: 412 }} component={Paper}>
                  <FormProvider methods={methods}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: 48, px: 0 }} align="center">
                            尺码
                          </TableCell>
                          <TableCell sx={{ width: 80, px: 0 }} align="center">
                            数量
                          </TableCell>
                          <TableCell sx={{ width: 80, px: 0 }} align="center">
                            价格
                          </TableCell>
                          <TableCell sx={{ width: 80, px: 0 }} align="center">
                            总价
                          </TableCell>
                          <TableCell sx={{ width: 80, px: 0 }} align="center">
                            备注信息
                          </TableCell>
                          <TableCell sx={{ width: 64, px: 0 }} align="center">
                            操作
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fields.map((row, index) => (
                          <TableRow key={row.skuId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ px: 0 }} align="center">
                              {row.size}
                            </TableCell>
                            <TableCell sx={{ px: 0 }} align="center">
                              <RHFTextField
                                required
                                InputProps={{
                                  type: 'number',
                                }}
                                onChange={(e) => setFormValue(row, index, 'num', e.target.value)}
                                value={formValues.goodsArr[index].num}
                                size="small"
                                name={`goodsArr[${index}].num`}
                                sx={{ width: '90%', textAlign: 'center' }}
                              />
                            </TableCell>

                            <TableCell sx={{ px: 0 }} align="center">
                              <RHFTextField
                                required
                                InputProps={{
                                  type: 'number',
                                }}
                                onChange={(e) => setFormValue(row, index, 'storagePrice', e.target.value)}
                                value={formValues.goodsArr[index].storagePrice}
                                size="small"
                                name={`goodsArr[${index}].storagePrice`}
                                sx={{ width: '90%', textAlign: 'center' }}
                              />
                            </TableCell>
                            <TableCell sx={{ px: 0 }} align="center">
                              {Number(formValues.goodsArr[index].num) * Number(formValues.goodsArr[index].storagePrice)}
                            </TableCell>
                            <TableCell sx={{ px: 0 }} align="center">
                              <RHFTextField
                                value={formValues.goodsArr[index].notes}
                                style={{ textAlign: 'center', lineHeight: 30 }}
                                size="small"
                                onChange={(e) => setFormValue(row, index, 'notes', e.target.value)}
                                name={`goodsArr[${index}].notes`}
                                sx={{ width: '90%', p: 0 }}
                              />
                            </TableCell>
                            <TableCell sx={{ px: 0 }} align="center">
                              <Typography
                                onClick={() => handleRemove(row, index)}
                                color={theme.palette.error.main}
                                variant="body1"
                              >
                                删除
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormProvider>
                </TableContainer>
              </>
            ) : null}
          </Card>
        </Stack>
      </DialogContent>
      {Object.keys(selectedGoods).length ? (
        <DialogActions sx={{ p: 3 }}>
          <LoadingButton loading={isSubmitting} variant="contained" onClick={handleConfirm}>
            确定入库
          </LoadingButton>
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
