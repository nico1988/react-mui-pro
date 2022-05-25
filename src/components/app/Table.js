import PropTypes from 'prop-types';
import { forwardRef, Fragment, useCallback, useEffect, useImperativeHandle, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Table, TableContainer, TableBody, TableRow,
  TableCell, TablePagination, Checkbox, Stack, Button, Box,
  Typography
} from '@mui/material';
import Scrollbar from 'src/components/Scrollbar';
// import SearchNotFound from 'src/components/SearchNotFound';
// components
import { TableHeadCustom } from 'src/components/table';
import EmptyContent from 'src/components/EmptyContent';
import Iconify from 'src/components/Iconify';


// ----------------------------------------------------------------------

const i18NModuleKey = 'components.app.table';

const AppTable = forwardRef(({
  tableColumns,
  list = [],
  total = 0,
  rowKey = 'id',
  btnText = {},
  clearList,
  getI18nText,
  batch = true,
  onLoad,
  onAdd,
  onEdit,
  onDelete,
  actions
}, ref) => {
  const theme = useTheme();
  // const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [hasAction, setHasAction] = useState(false);
  const [columns, setColumns] = useState([]);
  const [currentList, setCurrentList] = useState();
  // const [orderBy, setOrderBy] = useState('createdAt');

  // const handleRequestSort = (property) => {
  // const isAsc = orderBy === property && order === 'asc';
  // setOrder(isAsc ? 'desc' : 'asc');
  // setOrderBy(property);
  // };

  useEffect(() => {
    if (!list[page]) {
      // 第一页没数据 就请求第一页
      if (!page || list[0]) {
        onLoad(page, rowsPerPage);
      } else {
        setPage(0);
      }
    }
  }, [list, page, rowsPerPage, onLoad]);

  useEffect(() => {
    if (list) setCurrentList(list[page]);
  }, [list, page]);

  // 转换标签文案
  useEffect(() => {
    if (columns && getI18nText) {
      columns.map(v => {
        if (!v.label && getI18nText) {
          v.label = getI18nText(v.id, 'label', getI18nText(v.id, 'label', undefined, i18NModuleKey));
        }
        return v;
      });
    }
  }, [columns, getI18nText]);

  // 是否显示操作按钮
  useEffect(() => {
    setHasAction(!!onEdit || !!onDelete);
  }, [onEdit, onDelete]);

  // 填充操作按钮
  useEffect(() => {
    if (tableColumns) {
      setColumns([
        ...tableColumns,
        ...(hasAction ? [{ id: '_action' }] : []),
      ])
    }
  }, [tableColumns, hasAction]);

  // 全选/全不选
  const handleSelectAllClick = useCallback((checked) => {
    if (checked) {
      const selected = currentList?.map(n => n[rowKey]);
      setSelected(selected);
      return;
    }
    setSelected([]);
  }, [currentList, rowKey]);

  // 左侧选择
  const handleClick = useCallback((rowKey) => {
    const selectedIndex = selected.indexOf(rowKey);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, rowKey);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  }, [selected]);

  // 修改每页行数
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    // setPage(0);
    clearList();
  };

  // const emptyRows = currentList?.length ? rowsPerPage - currentList.length : 0;
  const isNotFound = currentList && !currentList.length;

  // 外部调用内部函数
  useImperativeHandle(ref, () => ({
    // 重载数据
    reload: (p) => {
      onLoad(p === undefined ? page : p, rowsPerPage);
    },
    // 清空数据
    getCurrentPage: () => ({
      page,
      rowsPerPage,
    }),
  }));

  const actionsNode = useCallback((key, item) => {
    /* 编辑 */
    const EditBtn = onEdit ? <Typography noWrap sx={{
      color: theme.palette.info.main,
      cursor: 'pointer'
    }} onClick={() => onEdit(item)}>
      {getI18nText('edit', 'button', undefined, i18NModuleKey)}
    </Typography> : null;
    /* 删除 */
    const DeleteBtn = onDelete ? <Typography noWrap sx={{
      cursor: 'pointer',
      color: theme.palette.error.main,
    }} onClick={() => onDelete(key, () => setSelected(selected.filter(v => v !== key)))}>
      {getI18nText('delete', 'button', undefined, i18NModuleKey)}
    </Typography> : null;

    if (actions) return actions(item, {
      EditBtn,
      DeleteBtn, 
    });
    return <>
      {EditBtn}
      {DeleteBtn}
    </>
  }, [onEdit, getI18nText, onDelete, actions, selected, theme]);

  return (<>
    <Stack
      spacing={2}
      direction="row"
      sx={{ px: 3, mt: 2.5, justifyContent: 'space-between', alignItems: 'center' }}
    >
      {onAdd && <Box sx={{
        height: 72
      }}>
        <Button onClick={() => onAdd(selected)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
          {btnText.add || getI18nText('add', 'button', undefined, i18NModuleKey)}
        </Button>
      </Box>}

      {batch && <Box sx={{
        height: 72
      }}>
        { onDelete && <Button disabled={!selected.length} onClick={() => onDelete(selected, () => setSelected([]))}
          startIcon={<Iconify icon="ep:delete" />}
          sx={{
            mr: -1,
            color: theme.palette.text.primary,
          }}>
          {btnText.delete || getI18nText('delete', 'button', undefined, i18NModuleKey)}
        </Button>}
      </Box>}
    </Stack>
    <Scrollbar>
      {columns?.length && <TableContainer sx={{ minWidth: 800 }}>
        <Table>
          <TableHeadCustom
            // order={order}
            // orderBy={orderBy}
            headLabel={columns}
            rowCount={currentList?.length}
            numSelected={selected.length}
            // onSort={handleRequestSort}
            onSelectAllRows={handleSelectAllClick}
            cellSx={{
              height: 32,
              py: 0,
              boxSizing: 'border-box',
            }}
          />

          <TableBody>
            {currentList?.map((item) => {
              const key = item[rowKey];
              const isItemSelected = selected.indexOf(key) !== -1;

              return (
                <TableRow
                  hover
                  key={key}
                  tabIndex={-1}
                  role="checkbox"
                  selected={isItemSelected}
                  aria-checked={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} onClick={() => handleClick(key)} />
                  </TableCell>
                  {columns.map(v => {
                    const { id, dataKey, format, props = {} } = v;
                    const value = item[dataKey];
                    return <TableCell key={id} align="center" sx={{
                      height: 40,
                      minWidth: 100,
                      py: 0,
                    }} {...props}>
                      {(() => {
                        if (id === '_action') return <Stack direction="row" spacing={1} 
                                                      sx={{ justifyContent: 'center'}}>
                          {actionsNode(key, item)}
                        </Stack>
                        if (format) return format(value, item);
                        return <Typography noWrap sx={{ width: 'inherit' }}>{value}</Typography>
                      })()}
                    </TableCell>
                  })}
                </TableRow>
              );
            })}
            {/* {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
          </TableBody>

          {isNotFound && (
            <TableBody>
              <TableRow>
                <TableCell align="center" colSpan={12}>
                  {/* <Box sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={'23232'} />
                  </Box> */}
                  <EmptyContent sx={{ py: 10 }} />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>}
    </Scrollbar>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={total}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={(event, value) => setPage(value)}
      onRowsPerPageChange={handleChangeRowsPerPage}
      sx={{
        '.css-l6w8pl-MuiToolbar-root-MuiTablePagination-toolbar': {
          height: 56
        }
      }}
    />
  </>);
});

AppTable.propTypes = {
  tableColumns: PropTypes.array, // 显示内容
  list: PropTypes.array.isRequired, // 数据 [[第一页数据], [第二页数据]]
  total: PropTypes.number.isRequired, // 数据总数
  rowKey: PropTypes.string, // 识别标识 - 如删除时要传的值, 默认id
  btnText: PropTypes.object, // 覆盖内部的按钮文案
  getI18nText: PropTypes.func, // 本地化翻译
  batch: PropTypes.bool, // 是否批量操作, 默认true
  clearList: PropTypes.func.isRequired, // 清空数据, 用于触发切换到第一页 并请求数据
  onLoad: PropTypes.func.isRequired,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  actions: PropTypes.func,
};

export default AppTable;