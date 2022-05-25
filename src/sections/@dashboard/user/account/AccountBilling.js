import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { Box, Grid, Card, Button, Typography, Stack, Paper, TablePagination } from '@mui/material';
import useLocales from '../../../../hooks/useLocales';
import { getOrderList } from '../../../../services/services';
// components
import Iconify from '../../../../components/Iconify';
import EmptyContent from '../../../../components/EmptyContent';
import { DocIllustration } from '../../../../assets';
import { fDateTime } from '../../../../utils/formatTime';
//
// import AccountBillingAddressBook from './AccountBillingAddressBook';
// import AccountBillingPaymentMethod from './AccountBillingPaymentMethod';
// import AccountBillingInvoiceHistory from './AccountBillingInvoiceHistory';

// ----------------------------------------------------------------------

AccountBilling.propTypes = {
};

const values = [{
  key: 'packageType',
  valueKey: 'title',
}, {
  key: 'paymentMethod',
  valueKey: 'paidType',
  format(v, getText) {
    console.log(v)
    return getText(v, 'value.paidType');
  }
}, {
  key: 'price',
  valueKey: 'amount',
  format(v) {
    return `¥${v / 100}`;
  }
}, {
  key: 'orderTime',
  valueKey: 'paidTime',
  format(v) {
    return fDateTime(v);
  }
}]


let sub = true;
export default function AccountBilling() {
  const { getI18nText } = useLocales('sections.dashboard.userAccount.billing');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState();

  const onLoad = useCallback(async(page, rowsPerPage) => {
    if (!sub) return;
    sub = false;
    await getOrderList({
      pageIndex: page + 1,
      pageSize: rowsPerPage,
    }).then(res => {
      const { data: list = [], total, pageIndex } = res;
      setOrders(list);
      setTotal(total);
      setPage(pageIndex);
    })
    sub = true;
  }, []);
  
  useEffect(() => {
    onLoad(0, rowsPerPage);
  }, [rowsPerPage, onLoad]);


  const handleChangePage = (event, newPage) => {
    onLoad(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {getI18nText('historyBill', 'title')}
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(16, 1fr)" gap={3} sx={{ width: '100%' }}>
          {orders && !orders.length && <EmptyContent
            sx={{ 
              gridColumnStart: 7,
              gridColumnEnd: 10,
              height: 'auto' 
            }}
          />}
          {orders?.map((v) => (
            <Box gridColumn="span 4" key={v.id}>
              <Paper
                sx={{
                  display: 'block',
                  px: 2,
                  py: 3,
                  bgcolor: 'background.neutral',
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  {getI18nText('bill', 'title')} : {v.id}
                </Typography>

                {values.map(c => <Typography variant="body2" gutterBottom dkey={v.key} >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    {getI18nText(c.key, 'label')}: &nbsp;
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ whiteSpace: 'nowrap' }}>
                  {c.format ? c.format(v[c.valueKey], getI18nText) :  v[c.valueKey]}
                  </Typography>
                </Typography>)}
              </Paper>
            </Box>
          ))}
        </Box>
        <TablePagination
          component="div"
          count={total}
          page={page-1}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ width: '100%'}}
        />
      </Stack>
    </Card>
  );
}
