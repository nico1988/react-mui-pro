import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import {
  InputAdornment,
  Stack,
  Button, Box,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';

SearchForm.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onSearch: PropTypes.func,
  onReset: PropTypes.func,
  onAddRole: PropTypes.func,
  deleteRoles: PropTypes.func,
};

export default function SearchForm({ filterName, onFilterName, onSearch, onReset, onAddRole, deleteRoles }) {

  return (
    <Stack>
      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
        <InputStyle
          label='角色名称'
          stretchStart={240}
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder="请输入角色名称"
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
      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{pt:3, px: 3,pb:2.5,justifyContent:'space-between' }}>
        <Button onClick={onAddRole} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
          新增角色
        </Button>
        <Box >
          <Button onClick={deleteRoles} startIcon={<Iconify icon="ep:delete" />} >
            删除
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}
