import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Stack,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  TableHead,
  TableSortLabel,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// utils
import { fDate, fDateTime, fTimestamp } from '../../../utils/formatTime';
import { fCurrency, fDataD100 } from '../../../utils/formatNumber';
// hooks
import useSettings from '../../../hooks/useSettings';
import useToggle from '../../../hooks/useToggle';

// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// sections
import Iconify from '../../../components/Iconify';
import {
  auditCaiGou,
  deleteCaiGou,
  getCaiGouOrderList,
  getOperator, queryCaiGou,
  revertAuditCaiGou,
} from '../../../services/caigou';
import AddCaiGou1Dialog from './components/caigou-add1';
import { getKeyName } from '../../../utils/util';
import { CHECK_STATUS_OPTIONS } from '../../../utils/options';
import { setGlobalMessage } from '../../../redux/slices/global';
import CaiGouSearchForm from "../components/searchForm";
import CaiGouPagination from "../components/custom-pagination";
import {textOverflow} from "../../../assets/css/commonStyle";



export default function CaigouOrder() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const CHECK_STATUS_COLOR = ['error', 'success', 'info','info'];
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hideBtn,setHideBtn]=useState(1) // 1新增 2 查看 3编辑
  const [selectedData,setSelectedData]=useState({})
  const [total,setTotal]=useState(0)
  const [pagination, setP] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState({
    productInfo: '',
    purchaseOrderNo: '',
    createUserId: '',
    startDate: null,
    endDate: null,
  });
  const [list, setList] = useState([]);
  const getList = (p) => {
    getCaiGouOrderList(p || { ...pagination, ...search }).then((r) => {
      setList(r.data);
      setTotal(r.total)
    });
  };






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

  const handleChangeRowsPerPage = (event) => {
    const newP = { ...pagination, pageSize: parseInt(event.target.value, 10) };
    setP(newP);
    getList({ ...search, ...newP });
  };
  const handlePageChange = (value) => {
    const newP = { ...pagination, pageIndex: value };
    setP(newP);
    getList({ ...search, ...newP });
  };

  const handleDeleteProduct = (productId) => {
    const deleteProduct = productList.filter((product) => product.id !== productId);
    setSelected([]);
    setProductList(deleteProduct);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productList.length) : 0;

  // 采购1
  const { toggle: openAdd1, onOpen: onOpenAdd1, onClose: onCloseAdd1 } = useToggle();
  const caiGou1Props = {
    onOpenAdd1,
    onClose: onCloseAdd1,
    getList,hideBtn,selectedData
  };
  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = list.map((n) => n.id);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };

  // 审核
  const onAudit=()=>{
    auditCaiGou(selected).then(r=>{
      dispatch(setGlobalMessage({
        variant: 'success',
        msg: '操作成功！',
      }))
      getList()
    })
  }
  const onRevertAudit=()=>{
    revertAuditCaiGou(selected).then(r=>{
      dispatch(setGlobalMessage({
        variant: 'success',
        msg: '操作成功！',
      }))
      getList()
    })
  }
  const onDelete=(id)=>{
    deleteCaiGou(id || selected).then(r=>{
      dispatch(setGlobalMessage({
        variant: 'success',
        msg: '操作成功！',
      }))
      setSelected([]);
      getList()
    })
  }

  const onReadCaiGou=(row,type)=>{
    if(type===1){ // 查看
      setHideBtn(2);
    }else { // 编辑
      setHideBtn(3)
      if(row.status!==0){
        dispatch(setGlobalMessage({
          variant: 'warning',
          msg: '抱歉，只有未审核的单据才能编辑！',
        }))
        return;
      }
    }
    queryCaiGou(row.id).then(r=>{
      setSelectedData(r.data);
      onOpenAdd1();
    })
  }
  // 点击新增
  const onClickAdd=()=>{
    setHideBtn(1);
    setSelectedData({})
    onOpenAdd1();
  }

  const sameProps={search,pagination,setP,getList}

  return (
    <Page title="采购管理: 采购订单">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="采购订单" links={[{ name: '采购管理' }, { name: '采购订单' }]} />
        <Card>
          <CaiGouSearchForm {...sameProps} setSearch={setSearch}/>
          <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ pt: 2, px: 3, pb: 2.5, justifyContent: 'space-between' }}
          >
            <Button onClick={onClickAdd} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              新增采购订单
            </Button>

            <Box>
              <Button disabled={!selected.length} onClick={onAudit} startIcon={<Iconify icon="mdi:account-outline" />}>审核</Button>
              <Button disabled={!selected.length} onClick={onRevertAudit} startIcon={<Iconify icon="mdi:account-off-outline" />}>反审核</Button>
              <Button disabled={!selected.length} onClick={onDelete} startIcon={<Iconify icon="ep:delete" />}>删除</Button>
            </Box>
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < list.length}
                        checked={list.length > 0 && selected.length === list.length}
                        onChange={e=>handleSelectAllClick(e.target.checked)}
                      />
                    </TableCell>
                    <TableCell align="left">单据编号</TableCell>
                    <TableCell align="left">商品名称</TableCell>
                    <TableCell align="center">数量</TableCell>
                    <TableCell align="center">金额</TableCell>
                    <TableCell align="left">单据日期</TableCell>
                    <TableCell align="center">操作员</TableCell>
                    <TableCell align="center">状态</TableCell>
                    <TableCell align="center">操作</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {list.map((row) => {
                    const { id } = row;

                    const isItemSelected = selected.indexOf(id) !== -1;
                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell align="center" padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(row)} />
                        </TableCell>
                        <TableCell align="left">{row.purchaseOrderNo}</TableCell>
                        <TableCell align="left" style={{ minWidth: 160 }}>
                          <p style={{ ...textOverflow, width: 296 }}>{row.productName}</p>
                        </TableCell>
                        <TableCell align="center">{row.totalNum}</TableCell>
                        <TableCell align="center">{fDataD100(row.totalPrice)}</TableCell>
                        <TableCell align="left">{fDateTime(row.createDate)}</TableCell>
                        <TableCell align="center">{row.createUserName}</TableCell>
                        <TableCell align="center">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={CHECK_STATUS_COLOR[row.status]}
                          >
                            {getKeyName(row.status, CHECK_STATUS_OPTIONS)}
                          </Label>
                        </TableCell>

                        <TableCell align="center">
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                            <Typography onClick={()=>onReadCaiGou(row,1)} color={theme.palette.info.main} variant="body1">
                              查看
                            </Typography>
                            <Typography onClick={()=>onReadCaiGou(row,2)} color={theme.palette.info.main} variant="body1">
                              编辑
                            </Typography>
                            <Typography onClick={()=>onDelete(id)} color={theme.palette.error.main} variant="body1">
                              删除
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>


              </Table>
            </TableContainer>
          </Scrollbar>

          <CaiGouPagination total={total} {...sameProps}/>

        </Card>
      </Container>
      <AddCaiGou1Dialog {...caiGou1Props} open={openAdd1} />
    </Page>
  );
}

