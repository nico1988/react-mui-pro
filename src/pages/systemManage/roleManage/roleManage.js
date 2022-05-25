import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Stack,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { ProductListHead } from '../../../sections/@dashboard/e-commerce/product-list';
import SearchForm from './components/searchForm';
import AddRoleDialog from './components/roleEdit';
import AssignPermissionDialog from './components/assignPermission';
import { setGlobalMessage } from '../../../redux/slices/global';
import { useDispatch } from '../../../redux/store';
import { getRolesList, deleteRoles } from '../../../services/roles';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignCenter: true },
  { id: 'name', label: '角色名称', alignCenter: true },
  { id: 'menus', label: '权限内容', alignCenter: true },
  { id: 'desc', label: '描述备注', alignCenter: true },
  { id: 'createdTime', label: '创建时间', alignCenter: true },
  { id: 'opt', label: '操作', alignCenter: true },
];

export default function RoleManage() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [roleList, setRoleList] = useState([
    // {
    //   id: 1,
    //   name: '管理员',
    //   menus: ['订单管理', '角色管理', '权限管理'],
    //   desc: '这是一个管理员角色账户',
    //   createdTime: '2022-04-27',
    // },
    // {
    //   id: 2,
    //   name: '管理员',
    //   menus: ['订单管理', '角色管理', '权限管理'],
    //   desc: '这是一个管理员角色账户',
    //   createdTime: '2022-04-27',
    // },
  ]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [type, setType] = useState('add');
  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const [visiblePermission, setVisiblePermission] = useState(false);

  useEffect(() => {
    getRoleList();
  }, [page, rowsPerPage]);

  // 获取角色列表数据
  const getRoleList = async () => {
    const params = {
      name: filterName,
      pageIndex: page,
      pageSize: rowsPerPage,
    };
    const { data = [] } = await getRolesList(params);
    console.log(data, 'data');
    setRoleList(data);
  };

  // 搜索条件设置
  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
  }; 

  // 点击搜索按钮触发事件
  const onSearch = () => {
    setPage(0);
    getRoleList();
  };

  // 点击重置按钮触发事件
  const onReset = () => {
    setFilterName('');
    setPage(0);
    getRoleList();
  };

  // 切换每页展示数量
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 新增、编辑角色
  const onEditRole = (row = {}, type = 'add') => {
    setSelectedData(row);
    setType(type);
    setVisible(true);
  };

  // 删除角色
  const onDeleteRole = (ids) => {
    deleteRoles(ids).then((res) => {
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
  const deleteBatchRoles = () => {
    if (selected.length === 0) {
      dispatch(
        setGlobalMessage({
          variant: 'error',
          msg: '请勾选列表数据！',
        })
      );
      return false;
    };
    onDeleteRole(selected.join(','));
  };

  // 分配权限
  const onAssignPermission = (row) => {
    setSelectedData(row);
    setVisiblePermission(true);
  };

  // 列表全部勾选
  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = roleList.map((n) => n.id);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };
  // 列表部分勾选
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roleList.length) : 0;

  const isNotFound = !roleList.length && Boolean(filterName);

  const tagClass = {
    padding: '2px 4px',
    background: 'rgba(0, 171, 85, 0.08)',
    margin: '0 4px 2px 0',
    borderRadius: '4px',
    display: 'inline-block',
  };

  return (
    <Page title="系统管理: 角色管理">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="角色管理"
          links={[
            { name: '系统管理' },
            { name: '角色管理' },
          ]}
        />

        <Card>
          <SearchForm
            filterName={filterName}
            onFilterName={handleFilterByName}
            onSearch={onSearch}
            onReset={onReset}
            onAddRole={() => onEditRole()}
            deleteRoles={deleteBatchRoles}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductListHead
                  headLabel={TABLE_HEAD}
                  rowCount={roleList.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {roleList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, menus = [], desc, createdTime } = row;

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
                        <TableCell style={{ minWidth: 120 }}>{name}</TableCell>
                        <TableCell style={{ minWidth: 200 }} alignItems="center">
                          { menus && menus.length !== 0 && menus.map((item, index) => <div style={tagClass} key={index}>{item}</div>) }
                        </TableCell>
                        <TableCell style={{ minWidth: 140 }}>{desc}</TableCell>
                        <TableCell style={{ minWidth: 120 }}>{fDateTime(createdTime)}</TableCell>
                        <TableCell style={{ minWidth: 200 }} alignItems="center">
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                            <Typography onClick={() => onAssignPermission(row)} color={theme.palette.info.main} variant="body1" style={{ cursor: 'pointer' }}>
                              分配权限
                            </Typography>
                            <Typography onClick={() => onEditRole(row, 'edit')} color={theme.palette.info.main} variant="body1" style={{ cursor: 'pointer' }}>
                              编辑
                            </Typography>
                            <Typography onClick={() => onDeleteRole([id])} color={theme.palette.error.main} variant="body1" style={{ cursor: 'pointer' }}>
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

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={roleList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <AddRoleDialog
          open={visible}
          onClose={() => setVisible(false)}
          type={type}
          getList={onSearch}
          selectedData={selectedData}
        />
        <AssignPermissionDialog
          open={visiblePermission}
          onClose={() => {
            setVisiblePermission(false);
            setSelectedData({});
          }}
          getList={onSearch}
          selectedData={selectedData}
        />
      </Container>
    </Page>
  );
}
