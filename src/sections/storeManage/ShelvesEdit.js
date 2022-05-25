import * as Yup from 'yup';
import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
// hook
import useLocales from 'src/hooks/useLocales';
// components
import { DialogForm } from 'src/components/app/dialog';
import { InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------
const FORM_CONFIG = [
  [{
    id: 'wName',
    dataKey: 'warehouseId',
    type: "select",
    options: undefined,
    validation: (getI18nText) => ({
      required: getI18nText('wName', 'required'),
    })
  }, {
    id: 'area',
    dataKey: 'area',
    validation: (getI18nText) => ({
      required: getI18nText('area', 'required'),
    })
  }],
  [{
    id: 'shelves',
    dataKey: 'shelves',
    validation: (getI18nText) => ({
      required: getI18nText('shelves', 'required'),
    }),
  }, {
    id: 'max',
    dataKey: 'maximumPlacingQuantity',
    props: {
      type: 'number',
    },
    validation: (getI18nText) => ({
      required: getI18nText('max', 'required'),
    }),
  }],
  {
    id: 'notes',
    dataKey: 'notes'
  },
];

// ----------------------------------------------------------------------
WarehouseEdit.propTypes = {
  warehouseOptions: PropTypes.array,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  defaultValues: PropTypes.object, // 表单默认值
  onSubmit: PropTypes.func,
};

export default function WarehouseEdit({
  warehouseOptions,
  open,
  defaultValues = {
    warehouseId: '',
    area: '',
    shelves: '',
    maximumPlacingQuantity: '',
    notes: '',
  },
  onSubmit,  
  onClose,
}) {
  const { getI18nText } = useLocales('sections.storeManage.shelvesEdit');
  const [ formConfig, setFormConfig ] = useState();

  useEffect(() => {
    // 选项注入
    if (warehouseOptions && !formConfig) {
      let isFound = false;
      for (let i = 0, len = FORM_CONFIG.length; i < len; i += 1) {
        const group = FORM_CONFIG[i];
        if (Object.prototype.toString.call(group) === '[object Array]') {
          for (let c = 0, cLen = group.length; c < cLen; c += 1) {
            if (group[c].id === 'wName') {
              group[c].options = warehouseOptions;
              isFound = true;
              break;
            }
          }
        } else if (group.id === 'wName') {
          group.options = warehouseOptions;
          isFound = true;
        }
        if (isFound) break;
      }
      setFormConfig(FORM_CONFIG);
    }
  }, [warehouseOptions, formConfig]);

  if (!formConfig) return null;

  return <DialogForm open={open}
    title={getI18nText(defaultValues ? 'edit' : 'add', 'title')}
    formConfig={formConfig}
    defaultValues={defaultValues}
    getI18nText={getI18nText}
    onSubmit={(value) => {
      value.maximumPlacingQuantity = Number(value.maximumPlacingQuantity);
      console.log(defaultValues)
      if (defaultValues.id) value.id = defaultValues.id;  
      onSubmit(value, onClose);
    }}
    dialogProps={{
      onClose,
      actionConfirm: {
        btnText: getI18nText(defaultValues ? 'edit' : 'add', 'button'),
      }
    }} />
}