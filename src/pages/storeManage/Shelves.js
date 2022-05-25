import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// @mui
import {
  Card,
  Container,
} from '@mui/material';
// redux
import { setGlobalMessage } from 'src/redux/slices/global';
import { getWarehouseList } from 'src/services/warehouse';
import { getShelfList, addShelf, updateShelf, deleteShelf } from 'src/services/shelf';
import { useDispatch, useSelector } from 'src/redux/store';
// hooks
import useLocales from 'src/hooks/useLocales';
import useSettings from 'src/hooks/useSettings';
import useAuth from 'src/hooks/useAuth';
// components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import AppTable from 'src/components/app/Table';
import SearchForm from 'src/components/app/SearchForm';
import ShelvesEdit from 'src/sections/storeManage/ShelvesEdit';

// ----------------------------------------------------------------------
// 表格内容
const TABLE_CLOUMNS = [
  { id: 'wName', dataKey: 'warehouseName' },
  { id: 'area', dataKey: 'area' },
  { id: 'shelves', dataKey: 'shelves' },
  { id: 'count', dataKey: 'count' },
  { id: 'max', dataKey: 'maximumPlacingQuantity' },
  { id: 'notes', dataKey: 'notes' },
];

// 搜索项目
const SEARCH_FORM = [
  {
    id: 'wName',
    dataKey: 'id',
    type: 'select',
    props: {
    }
  },
  {
    id: 'area',
    dataKey: 'area',
  }
];
const SEARCH_DEFAULT = {
  area: '',
  id: '',
}
// ----------------------------------------------------------------------

export default function Warehouse() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const { isSub } = useAuth();
  const { getI18nText } = useLocales('pages.storeManage.shelf');

  // const {
  //   relation,
  // } = useSelector(state => ({
  //   ...state.account,
  // }));
  // 仓库配置
  const [warehouse, setWarehouse] = useState({
    options: undefined,
    more: true,
    page: 0,
  });

  const sub = useRef(true);
  // 页面标题相关
  const [title, setTitle] = useState({
    page: '',
    pageRoot: '',
  });
  const [searchValues, setSearchValues] = useState(SEARCH_DEFAULT);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);

  // 弹窗
  const [showDialog, setShowDialog] = useState();
  // 编辑弹窗内容-新增传undefined
  const [editValue, setEditValue] = useState();

  // ref
  const tableRef = useRef(null);

  // 配置
  const [searchForm, setSearchForm] = useState();

  // 获取仓库数据 - page从1开始
  const getWarehouse = useCallback(async () => {
    if (!warehouse.more) return false;
    sub.current = false;
    
    try {
      const pageIndex = warehouse.page + 1;
      const resData = await getWarehouseList({
        pageIndex,
        pageSize: 50,
      });
      const list = resData.data;
      sub.current = true;
      setWarehouse(v => {
        v.page = pageIndex;
        v.more = list.length >= 50;
        v.options = [
          ...(v.options || []),
          ...list.map(v => ({
            label: v.warehouseName,
            value: v.id,
          }))
        ];
        return { ...v };
      })
    } catch (error) {
      sub.current = true;
      console.error(error);
    }
    return true;
  }, [warehouse]);

  useEffect(() => {
    // 获取仓库选项
   if (!warehouse.options && getWarehouse) getWarehouse();
  }, [getWarehouse, warehouse.options]);

  useEffect(() => {
    // 注入仓库选项
    const { options } = warehouse;
    if (options && !searchForm) {
      for (let i = 0, len = SEARCH_FORM.length; i < len; i += 1) {
        const item = SEARCH_FORM[i];
        if (item.id === 'wName') {
          item.options = options;
          // item.onLoad = getWarehouse;
          break;
        }
      }
      setSearchForm(SEARCH_FORM);
    }
  }, [warehouse, searchForm, getWarehouse]);

  useEffect(() => {
    if (getI18nText) {
      setTitle({
        pageRoot: getI18nText('storeManage', 'menu', undefined, ''),
        page: getI18nText('storeManageShelves', 'menu', undefined, ''),
      })
    }
  }, [getI18nText]);

  // 获取数据, 一般由表格内部调用
  const onLoad = useCallback(async (page, rowsPerPage) => {
    if (!sub.current) return false;
    sub.current = false;
    
    return getShelfList({
      ...searchValues,
      pageIndex: page + 1,
      pageSize: rowsPerPage,
    }).then(res => {
      const { data, total, pageIndex } = res;
      sub.current = true;
      setList(v => {
        v[pageIndex - 1] = data;
        return [...v];
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
      const { id, warehouseId, area, shelves, maximumPlacingQuantity, notes } = value;
      setEditValue({
        id,
        warehouseId,
        area,
        shelves,
        maximumPlacingQuantity,
        notes,
      });
    } else {
      setEditValue(value);
    }
    setShowDialog(show ? 'edit' : '');
  }, []);

  // 新增/编辑 - id有无区分
  const onEdit = useCallback(async (values, success) => {
    if (!sub.current) return false;
    sub.current = false;

    const isAdd = !values.id;
    try {
      await (isAdd ? addShelf : updateShelf)(values);
      dispatch(setGlobalMessage({
        variant: 'success',
        msg: getI18nText(isAdd ? 'addSuccess' : 'updateSuccess', 'tips'),
      }))
      sub.current = true;
      if (isAdd) {
        // 列表加载第一页
        // 清空列表会触发表格内部请求
        setList([]);
      } else {
        // 加载当前页
        console.log(tableRef.current)
        tableRef.current?.reload();
      }
      if (success) success();
    } catch (error) {
      sub.current = true;
      console.error(error);
    }
    return true;
  }, [dispatch, getI18nText]);

  const onDelete = useCallback(async (values, success) => {
    if (!sub.current || !values) return false;
    sub.current = false;

    const ids = typeof values !== 'object' ? [values] : values;
    try {
      await deleteShelf(ids);
      dispatch(setGlobalMessage({
        variant: 'success',
        msg: getI18nText('delSuccess', 'tips'),
      }))
      sub.current = true;
      // 删除当前页之后数据(包括当前页);
      const { page } = tableRef.current?.getCurrentPage();

      setList(v => v.slice(0, page));

      if (success) success();
    } catch (error) {
      sub.current = true;
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
          {useMemo(() => searchForm && <SearchForm
            defaultValues={searchValues}
            formConfig={searchForm}
            getI18nText={getI18nText}
            onSearch={searchHandle}
          />, [searchValues, searchForm, getI18nText, searchHandle])}
          <AppTable tableColumns={TABLE_CLOUMNS}
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
      {useMemo(() => !isSub && <ShelvesEdit open={showDialog === 'edit'}
        defaultValues={editValue}
        warehouseOptions={warehouse.options}
        onClose={() => setShowDialog()}
        onSubmit={onEdit} />, [isSub, warehouse, editValue, showDialog, onEdit])}
    </Page>
  );
};