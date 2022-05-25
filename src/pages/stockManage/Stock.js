import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// @mui
import {
  Card,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/system';
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
import { getStockList } from 'src/services/stock';
import InvoiceAnalytic from 'src/sections/@dashboard/invoice/InvoiceAnalytic';
import Scrollbar from 'src/components/Scrollbar';
import Image from 'src/components/Image';
import Label from 'src/components/Label';

// ----------------------------------------------------------------------
// 表格内容
const getTableColumns = (isSub) => [
  {
    id: 'logo',
    dataKey: 'spuLogo',
    format(src) {
      return <Image src={src} alt="logo" sx={{ width: 40 }} />
    }
  },
  {
    id: 'title',
    dataKey: 'title',
    props: {
      sx: {
        width: 180,
      }
    }
  },
  {
    id: 'aNum',
    dataKey: 'articleNumber',
  },
  {
    id: 'num',
    dataKey: 'num',
  },
  {
    id: 'lockNum',
    dataKey: 'lockNum',
  },
  ...(isSub ? [] : [{
    id: 'sTotal',
    dataKey: 'storageTotal',
    format(value) {
      return value / 100;
      // return fCurrency(value / 100);
    }
  },
  {
    id: 'sPrice',
    dataKey: 'storagePrice',
    format(value) {
      return value / 100;
      // return fCurrency(value / 100);
    }
  },
  // 市值总价
  {
    id: 'mTotal',
    dataKey: 'marketTotal',
    format(value) {
      return value / 100;
    // return fCurrency(value / 100);
    }
  },
  {
    id: 'pTotal',
    dataKey: 'profitTotal',
    format(value) {
      return value / 100;
      // return fCurrency(value / 100);
    }
  },
  {
    id: 'pRate',
    dataKey: 'profitRate',
    format(value) {
      return value / 100;
      // return fCurrency(value / 100);
    }
  },
  {
    id: 'gProfit',
    dataKey: 'grossProfit',
    format(value) {
      return value / 100;
      // return fCurrency(value / 100);
    }
  }]),
  {
    id: 'wName',
    dataKey: 'warehouseName',
  }
];

// 搜索项目
const SEARCH_FORM = [
  {
    id: 'wName',
    dataKey: 'warehouseId',
    type: 'select',
    props: {
    }
  },
  {
    id: 'title',
    dataKey: 'title',
  },
  {
    id: 'aNum',
    dataKey: 'articleNumber',
  },
  {
    id: 'zero',
    dataKey: 'zero',
    type: 'select',
    options: [
      {
        value: 0,
      },
      {
        value: 1,
      }
    ]
  }
];
const SEARCH_DEFAULT = {
  warehouseId: '',
  title: '',
  articleNumber: '',
  zero: 0,
}
// ----------------------------------------------------------------------

export default function Warehouse() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { isSub } = useAuth();
  const { getI18nText } = useLocales('pages.stockManage.stock');

  const [tableColumns, setTableColumns] = useState();

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

  // ref
  const tableRef = useRef(null);

  // 配置
  const [searchForm, setSearchForm] = useState();
  const [tabValue, setTabValue] = useState();

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
      sub.current = true;
      const list = resData.data;
      setWarehouse(v => {
        v.page = pageIndex;
        v.more = list.length >= 50;
        v.options = [
          ...(v.options || []),
          ...list.map(v => ({
            label: v.warehouseName,
            value: v.id,
            count: v.stockCount
          }))
        ];
        return { ...v };
      })
    } catch (error) {
      console.error(error);
    }
    sub.current = true;
    return true;
  }, [warehouse]);

  useEffect(() => {
    setTableColumns(getTableColumns(isSub));
  }, [isSub]);

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
      setTabValue(options[0].value);
    }
  }, [warehouse, searchForm, getWarehouse]);

  useEffect(() => {
    if (getI18nText) {
      setTitle({
        pageRoot: getI18nText('stockManage', 'menu', undefined, ''),
        page: getI18nText('stockManageStock', 'menu', undefined, ''),
      })
    }
  }, [getI18nText]);

  // 获取数据, 一般由表格内部调用
  const onLoad = useCallback(async (page, rowsPerPage) => {
    if (!sub.current) return false;
    sub.current = false;

    return getStockList({
      ...searchValues,
      warehouseId: searchValues.warehouseId || tabValue,
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
  }, [searchValues, tabValue]);

  // 搜索相关
  const searchHandle = useCallback((newValues = SEARCH_DEFAULT) => {
    // 要不要判断搜索条件没改变而且只有第一页数据不请求?
    //
    setSearchValues(newValues);
    // 清空列表会触发表格内部请求
    setList([]);
  }, []);

  const onDelete = useCallback(async (values, success) => {
    // if (!sub.current || !values) return false;
    // sub.current = false;

    // const ids = typeof values !== 'object' ? [values] : values;
    // try {
    //   await deleteShelf(ids);
    //   dispatch(setGlobalMessage({
    //     variant: 'success',
    //     msg: getI18nText('delSuccess', 'tips'),
    //   }))
    //   sub.current = true;
    //   // 删除当前页之后数据(包括当前页);
    //   const { page } = tableRef.current?.getCurrentPage();

    //   setList(v => v.slice(0, page));

    //   if (success) success();
    // } catch (error) {
    //   sub.current = true;
    //   console.error(error);
    // }
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
        {/* <Card> */}
        {useMemo(() => searchForm && <SearchForm
          defaultValues={searchValues}
          formConfig={searchForm}
          getI18nText={getI18nText}
          onSearch={searchHandle}
          sx={{
            px: 0,
            mt: -2.5,
          }}
        />, [searchValues, searchForm, getI18nText, searchHandle])}
        {/* </Card> */}
        <Card sx={{ mb: 3, mt: 1.5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="库存数"
                total={23}
                percent={100}
                price={24}
                unit=""
                icon="bxs:box"
                color={theme.palette.info.main}
              />
              <InvoiceAnalytic
                title="库存成本"
                total={24}
                percent={23}
                price={23}
                icon="ant-design:money-collect-filled"
                color={theme.palette.success.main}
              />
              <InvoiceAnalytic
                title="市值利润"
                total={23}
                percent={44}
                price={44}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.warning.main}
              />
              <InvoiceAnalytic
                title="实际利润"
                total={55}
                percent={33}
                price={33}
                icon="mdi:rotate-orbit"
                color={theme.palette.error.main}
              />
              <InvoiceAnalytic
                title="利润率"
                total={44}
                percent={44}
                price={33}
                icon="material-symbols:workspaces"
                color={theme.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          {!searchValues?.warehouseId && tabValue && <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={tabValue}
            onChange={(_, value) => {
              setTabValue(value);
              setList([]);
            }}
          >
            {warehouse.options?.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                label={
                  <Stack spacing={1} direction="row" alignItems="center">
                    <Label color={tab.color}> {tab.count || 0} </Label> <div>{tab.label}</div>
                  </Stack>
                }
              />
            ))}
          </Tabs>}
          {tabValue && <AppTable tableColumns={tableColumns}
            batch={false}
            ref={tableRef}
            list={list}
            total={total}
            getI18nText={getI18nText}
            clearList={() => setList([])}
            onDelete={onDelete}
            onLoad={onLoad}
            actions={(item, btnNode) => (
              <>
                <Typography noWrap sx={{
                  cursor: 'pointer',
                  color: theme.palette.info.main,
                }} onClick={() => console.log(item)}>
                  {getI18nText('detail', 'button')}
                </Typography>
                {btnNode.DeleteBtn}
              </>
            )} />}
        </Card>
      </Container>
      {/* 弹窗部分 */}
      {/* {useMemo(() => !isSub && <ShelvesEdit open={showDialog === 'edit'}
        defaultValues={editValue}
        warehouseOptions={warehouse.options}
        onClose={() => setShowDialog()}
        onSubmit={onEdit} />, [isSub, warehouse, editValue, showDialog, onEdit])} */}
    </Page>
  );
};
