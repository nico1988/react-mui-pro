import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// @mui
import {
  Card,
  Container,
} from '@mui/material';
// redux
import { addWarehouse, deleteWarehouse, getWarehouseList, updateWarehouse } from 'src/services/warehouse';
import { getRelation } from 'src/services/accounts';
import { setGlobalMessage } from 'src/redux/slices/global';
import { useDispatch, useSelector } from 'src/redux/store';
// import { setRelation } from 'src/redux/slices/account';
// hooks
import useLocales from 'src/hooks/useLocales';
import useSettings from 'src/hooks/useSettings';
import useAuth from 'src/hooks/useAuth';
// components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import AppTable from 'src/components/app/Table';
import SearchForm from 'src/components/app/SearchForm';
import WarehouseEdit from 'src/sections/storeManage/WarehouseEdit';

// ----------------------------------------------------------------------
// 表格内容
const tableColumns = [
  { id: 'id', dataKey: 'id' },
  { id: 'name', dataKey:'warehouseName' },
  { id: 'address', dataKey: 'warehouseAddress' },
  { id: 'stockCount', dataKey: 'stockCount' },
  { id: 'shelfCount', dataKey: 'shelfCount' },
  { id: 'fee', dataKey: 'fee', format:(v) => `${v} %`},
  { id: 'user', dataKey: 'accountUserName' },
  { id: 'notes', dataKey: 'notes' },
];

// 搜索项目
const searchForm = [
  {
    id: 'name',
    dataKey: 'warehouseName',
  },
  {
    id: 'notes',
    dataKey: 'notes',
  }
];
const SEARCH_DEFAULT = {
  warehouseName: '',
  notes: '',
}
// ----------------------------------------------------------------------

let sub = true;
export default function Warehouse() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const { isSub } = useAuth();
  const { getI18nText } = useLocales('pages.storeManage.warehouse');

  // const {
  //   relation,
  // } = useSelector(state => ({
  //   ...state.account,
  // }));

  // 账号关系
  const [ relation, setRelation ] = useState();
  // 页面标题相关
  const [title, setTitle] = useState({
    page: '',
    pageRoot: '',
  });
  const [ searchValues, setSearchValues ] = useState(SEARCH_DEFAULT);
  const [ list, setList ] = useState([]);
  const [ total, setTotal ] = useState(0);
  
  // 弹窗
  const [ showDialog, setShowDialog] = useState();
  // 编辑弹窗内容-新增传undefined
  const [ editValue, setEditValue] = useState();

  // ref
  const tableRef = useRef(null);

  useEffect(() => {
    // 主账号进来获取所有账号
    if (!isSub) {
      getRelation().then(res => {
        setRelation(res.data);
        // dispatch(setRelation());
      });
    } 
  }, [isSub]);

  useEffect(() => {
    if (getI18nText) {
      setTitle({
        pageRoot: getI18nText('storeManage', 'menu', undefined, ''),
        page: getI18nText('storeManageWarehouse', 'menu', undefined, ''),
      })
    }
  }, [getI18nText]);

  // 获取数据, 一般由表格内部调用
  const onLoad = useCallback(async(page, rowsPerPage) => {
    if (!sub) return false;
    sub = false;
    return getWarehouseList({
      ...searchValues,
      pageIndex: page + 1,
      pageSize: rowsPerPage,
    }).then(res => {
      const { data, total, pageIndex } = res;
      sub = true;
      setList(v => {
        v[pageIndex - 1] = data;
        return [ ...v ];
      })
      setTotal(total);
    });
  }, [searchValues]);

  // 搜索相关
  const searchHandle = useCallback((newValues = SEARCH_DEFAULT) => {
    // 要不要判断搜索条件没改变而且只有第一页数据不请求?
    //
    setSearchValues(newValues);
    // 清空列表会触发表格内部请求
    setList([]);
  }, []);

  // 编辑相关
  const editHandle = useCallback((show = 1, value = undefined) => {
    if (value?.id) {
      const { id, warehouseName, userAccountId, fee, warehouseAddress, notes } = value;
      setEditValue({
        id,
        warehouseName,
        userAccountId,
        fee,
        warehouseAddress,
        notes,
      });
    } else {
      setEditValue(value);
    }
    setShowDialog(show ? 'edit' : '');
  }, []);

  // 新增/编辑 - id有无区分
  const onEdit = useCallback(async (values, success) => {
    if (!sub) return false;

    const isAdd = !values.id;
    try {
      await (isAdd ? addWarehouse : updateWarehouse)(values);
      dispatch(setGlobalMessage({
        variant: 'success',
        msg: getI18nText(isAdd ? 'addSuccess' : 'updateSuccess', 'tips'),
      }))
      sub = true;
      if (isAdd) {
        // 列表加载第一页
        // 清空列表会触发表格内部请求
        setList([]);
      } else {
        // 加载当前页
        tableRef.current?.reload();
      }
      if (success) success();
    } catch (error) {
      sub = true;
      console.error(error);
    }
    return true;
  }, [dispatch, getI18nText]);
  
  const onDelete = useCallback(async (values, success) => {
    if (!sub || !values) return false;
    sub = false;

    console.log(values)
    const ids = typeof values !== 'object' ? [values] : values;
    try {
      await deleteWarehouse(ids);
      dispatch(setGlobalMessage({
        variant: 'success',
        msg: getI18nText('delSuccess', 'tips'),
      }))
      sub = true;
      // 删除当前页之后数据(包括当前页);
      const { page } = tableRef.current?.getCurrentPage();
      
      setList(v => v.slice(0, page));
      
      if (success) success();
    } catch (error) {
      sub = true;
      console.error(error);
    }
    return true;
  }, [dispatch, getI18nText]);

  return (
    <Page title={`${title.pageRoot}: ${title.page}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {useMemo(() => <HeaderBreadcrumbs
          heading={title.page}
          links={[
            { name: title.pageRoot },
            { name: title.page },
          ]}
        />, [title])}
        <Card>
          {useMemo(() => <SearchForm
            defaultValues={searchValues}
            formConfig={searchForm}
            getI18nText={getI18nText}
            onSearch={searchHandle}
          />, [searchValues, getI18nText, searchHandle])}
          <AppTable tableColumns={tableColumns} 
            ref={tableRef}
            list={list}
            total={total}
            getI18nText={getI18nText}
            clearList={() => setList([])}
            onAdd={() => editHandle()}
            onEdit={(item) => editHandle(1, item)}
            onDelete={onDelete}
            onLoad={onLoad} />
        </Card>
      </Container>
      {/* 弹窗部分 */}
      {useMemo(() => !isSub && relation && <WarehouseEdit open={showDialog === 'edit'}
        defaultValues={editValue}
        relation={relation}
        onClose={() => setShowDialog()}
        onSubmit={onEdit} />, [isSub, editValue, showDialog, relation, onEdit])}
    </Page>
  );
};
