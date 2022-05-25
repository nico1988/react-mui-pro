import { debounce } from 'lodash';
import PropTypes from 'prop-types';
// @mui
import {
  InputAdornment,
  Stack,
  Button, Box,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';

SearchForm.propTypes = {
  filterValue: PropTypes.object,
  onSearch: PropTypes.func,
  onReset: PropTypes.func,
  onFilterValue: PropTypes.func,
  onAddUser: PropTypes.func,
  deleteUsers: PropTypes.func,
};

export default function SearchForm({
  filterValue,
  onSearch,
  onReset,
  onFilterValue,
  onAddUser,
  deleteUsers,
}) {
  return (
    <Stack>
      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
        <InputStyle
          label='登录名称'
          stretchStart={240}
          value={filterValue.account}
          onChange={(event) => onFilterValue('account', event.target.value)}
          placeholder="请输入登录名称"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <InputStyle
          label='用户姓名'
          stretchStart={240}
          value={filterValue.name}
          onChange={(event) => onFilterValue('name', event.target.value)}
          placeholder="请输入用户姓名"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <Button onClick={debounce(onSearch, 300)} sx={{ width: 104 }} variant="outlined">
          查询
        </Button>

        <Button onClick={debounce(onReset, 300)} variant="outlined">
          重置
        </Button>

      </Stack>
      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ pt: 3, px: 3, pb: 2.5, justifyContent: 'space-between' }}>
        <Button onClick={onAddUser} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
          新增用户
        </Button>
        <Box >
          <Button onClick={deleteUsers} startIcon={<Iconify icon="ep:delete" />} >
            删除
          </Button>
        </Box>
      </Stack>
    </Stack >
  );
}
