import PropTypes from 'prop-types';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  InputAdornment,
  TextField,
  MenuItem,
  Stack,
  Button, Box,
} from '@mui/material';
// components
import { DatePicker } from '@mui/lab';
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

SearchForm.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDeleteProducts: PropTypes.func,
  optionsService: PropTypes.arrayOf(PropTypes.string),
};

export default function SearchForm({ numSelected, filterName, onFilterName, onDeleteProducts,optionsService }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const INPUT_WIDTH = 160;
  return (
    <Stack>

      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
        <InputStyle
          label='商品名称/货号'
          stretchStart={240}
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder="请输入"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <InputStyle
          label='订单号'
          stretchStart={240}
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder="请输入"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <DatePicker
          label="下单日期"
          placeholder="请选择"
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              sx={{
                maxWidth: { md: INPUT_WIDTH },
              }}
            />
          )}
        />
        <InputStyle
          label='收货地址'
          stretchStart={240}
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder="请输入"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Button  variant='outlined'>
          查询
        </Button>

        <Button  >
          重置
        </Button>


      </Stack>
    </Stack>
  );
}
