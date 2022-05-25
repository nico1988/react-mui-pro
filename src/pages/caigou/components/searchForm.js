import PropTypes from 'prop-types';
// @mui
import { Stack, Button, MenuItem, TextField, InputAdornment, Box } from '@mui/material';
// components
import { DateRangePicker, DateTimePicker } from '@mui/lab';
import { useEffect, useState } from 'react';
import Iconify from '../../../components/Iconify';
import InputStyle from '../../../components/InputStyle';
import { getOperator } from '../../../services/caigou';
import { fDateTime } from '../../../utils/formatTime';
// ----------------------------------------------------------------------

CaiGouSearchForm.propTypes = {
  search: PropTypes.object,
  setSearch: PropTypes.func,
  pagination: PropTypes.object,
  setP: PropTypes.func,
  getList: PropTypes.func,
};

export default function CaiGouSearchForm({ search, setSearch, pagination, setP, getList }) {
  const [operator, setOperator] = useState([]);
  const getOperatorOptions = () => {
    getOperator().then((r) => {
      setOperator(r.data);
    });
  };
  useEffect(() => {
    getOperatorOptions();
    getList();
  }, []);
  const onSearch = () => {
    const newP = { ...pagination, pageIndex: 1 };
    setP(newP);
    getList({ ...search, ...newP });
  };
  const onReset = () => {
    setSearch({});
    setP({ pageSize: 10, pageIndex: 1 });
    getList({});
  };
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <InputStyle
        size="small"
        label="单据编号"
        placeholder="CGDD00000000722"
        value={search.purchaseOrderNo}
        onChange={(e) => setSearch({ ...search, purchaseOrderNo: e.target.value })}
        sx={{ width: 264 }}
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
        label="商品信息"
        sx={{ width: 264 }}
        placeholder="条形码、名称、规格或型号"
        value={search.productInfo}
        onChange={(e) => setSearch({ ...search, productInfo: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
      <DateRangePicker
          mask='____-__-__'
        startText="开始日期"
        endText="结束日期"
        inputFormat="yyyy-MM-dd"
        placeholder="请选择"
        value={[search.startDate, search.endDate]}
        onChange={(newValue) => {
          setSearch({ ...search, startDate: newValue[0], endDate: newValue[1] });
        }}
        renderInput={(startProps, endProps) => (
          <>
            <TextField size="small" {...startProps} />
            <Box sx={{ mx: 2 }}> - </Box>
            <TextField size="small" {...endProps} />
          </>
        )}
      />

      <InputStyle
        size="small"
        label="操作员"
        fullWidth
        select
        value={search.createUserId}
        onChange={(e) => setSearch({ ...search, createUserId: e.target.value })}
        placeholder="请选择"
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          width: 136,
          textTransform: 'capitalize',
        }}
      >
        {operator.map((option) => (
          <MenuItem
            key={option.id}
            value={option.id}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </InputStyle>

      <Button onClick={onSearch} sx={{ width: 104 }} variant="outlined">
        查询
      </Button>

      <Button onClick={onReset} variant="outlined">
        重置
      </Button>
    </Stack>
  );
}
