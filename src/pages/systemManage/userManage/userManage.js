import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Stack,
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
} from '@mui/material';

// redux
import { useDispatch } from '../../../redux/store';
// utils
import { fDateTime } from '../../../utils/formatTime';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { ProductListHead } from '../../../sections/@dashboard/e-commerce/product-list';
import { setGlobalMessage } from '../../../redux/slices/global';
import SearchForm from './components/searchForm';
import AddUserDialog from './components/userEdit';
import { PAGINATION } from '../../../services/common/pagination';
import { getUserList, deleteUserAccount } from '../../../services/user-manage';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignCenter: true },
  { id: 'account', label: '登录账号', alignCenter: true },
  { id: 'name', label: '用户名', alignCenter: true },
  { id: 'userType', label: '用户类型', alignCenter: true },
  { id: 'roleName', label: '角色', alignCenter: true },
  { id: 'createdTime', label: '创建时间', alignCenter: true },
  { id: 'enabled', label: '状态', alignCenter: true },
  { id: 'opt', label: '操作', alignCenter: true },
];

export default function UserManage() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [filterValue, setFilterValue] = useState({
    account: '',
    name: '',
  });

  const [type, setType] = useState('add');
  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  useEffect(() => {
    getList();
  }, [page, rowsPerPage]);

  const getList = async () => {
    const params = {
      ...filterValue,
      pageIndex: page,
      pageSize: rowsPerPage,
    };
    const { data = [] } = await getUserList(params);
    console.log(data, 'data');
    setUserList(data);
  };

  // 搜索条件设置
  const handleFilter = (key, value) => {
    setFilterValue({ ...filterValue, [key]: value });
  };

  // 点击搜索按钮触发事件
  const onSearch = () => {
    setPage(0);
    getList();
  };

  // 点击重置按钮触发事件
  const onReset = () => {
    setFilterValue({ account: '', name: '' });
    setPage(0);
    getList();
  };

  // 每页显示条数切换
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 新增、编辑用户
  const onEditUser = (row = {}, type = 'add') => {
    setSelectedData(row);
    setType(type);
    setVisible(true);
  };

  // 删除角色
  const onDeleteUser = (ids) => {
    deleteUserAccount(ids).then((res) => {
      if (res.code === 'SUCCESS') {
        onSearch();
        dispatch(
          setGlobalMessage({
            variant: 'success',
            msg: '删除成功！',
          })
        );
      }
    })
  };

  // 点击删除按钮触发事件
  // eslint-disable-next-line consistent-return
  const deleteBatchUser = () => {
    if (selected.length === 0) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '请勾选列表数据！',
        })
      );
      return false;
    };
    onDeleteUser(selected.join(','));
  };

  // 列表全选
  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = userList.map((n) => n.id);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };

  // 列表单个勾选
  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const searchFormProps = {
    filterValue,
    onSearch,
    onReset,
    onFilterValue: handleFilter,
    onAddUser: onEditUser,
    deleteUsers: deleteBatchUser,
  }

  return (
    <Page title="系统管理: 用户管理">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="用户管理"
          links={[
            { name: '系统管理' },
            { name: '用户管理' },
          ]}
        />
        <Card>
          <SearchForm {...searchFormProps} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductListHead
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, account, name, userType, roleName, createdTime, enabled } = row;

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
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(id)} />
                        </TableCell>

                        <TableCell style={{ minWidth: 100 }}>{id}</TableCell>
                        <TableCell style={{ minWidth: 120 }}>{account}</TableCell>
                        <TableCell style={{ minWidth: 120 }}>{name}</TableCell>
                        <TableCell style={{ minWidth: 120 }}>{userType}</TableCell>
                        <TableCell style={{ minWidth: 120 }}>{roleName}</TableCell>
                        <TableCell style={{ minWidth: 120 }}>{fDateTime(createdTime)}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={!enabled ? 'error' : 'success'}
                          >
                            {!enabled ? '禁用' : '启用'}
                          </Label>
                        </TableCell>
                        <TableCell style={{ minWidth: 140 }} alignItems="center">
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                            <Typography onClick={() => onEditUser(row, 'edit')} color={theme.palette.info.main} variant="body1" style={{ cursor: 'pointer' }}>
                              编辑
                            </Typography>
                            <Typography onClick={() => onDeleteUser(id)} color={theme.palette.error.main} variant="body1" style={{ cursor: 'pointer' }}>
                              删除
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={PAGINATION.rowsPerPageOptions}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card >
        <AddUserDialog
          open={visible}
          onClose={() => setVisible(false)}
          type={type}
          getList={onSearch}
          selectedData={selectedData}
        />
      </Container >
    </Page >
  );
}
