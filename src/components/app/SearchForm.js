import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Button,
} from '@mui/material';
// components
import { FormProvider } from 'src/components/hook-form';
import DynamicForm from './DynamicForm';

// ----------------------------------------------------------------------

SearchForm.propTypes = {
  defaultValues: PropTypes.object.isRequired,
  formConfig: PropTypes.array.isRequired,
  onSearch: PropTypes.func,
  getI18nText: PropTypes.func,
  sx: PropTypes.object,
};

export default function SearchForm({
  defaultValues,
  formConfig,
  onSearch,
  getI18nText,
  sx = {},
}) {
  // const isMountedRef = useIsMountedRef();
  const theme = useTheme();

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // 翻译文案
  const getComponentText = useCallback((key, type = '') => {
    if (!getI18nText) return '';
    return getI18nText(key, type, undefined, 'components.app.search');
  }, [getI18nText]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSearch)}>
      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{
        py: 2.5,
        px: 3,
        ...sx,
      }}>
        {useMemo(() => <DynamicForm formConfig={formConfig}
          getI18nText={getI18nText}
          size="small"
          sx={{
            width: 186,
          }} />, [formConfig, getI18nText])}

        <Stack spacing={3} direction="row" sx={{
          display: 'inline-flex',
          height: '100%'
        }}>
          <LoadingButton type="submit" variant="outlined" loading={isSubmitting} sx={{ width: 104, height: '100%', }} >
            {getComponentText('search', 'button')}
          </LoadingButton>

          <Button variant="outlined" sx={{
            width: 57,
            height: '100%',
            minWidth: 'auto',
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
          }} onClick={() => {
            reset();
            onSearch();
          }}>{getComponentText('reset', 'button')}</Button>
        </Stack>
      </Stack>

    </FormProvider>
  );
}
