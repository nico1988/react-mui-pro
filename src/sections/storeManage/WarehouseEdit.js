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
  {
    id: 'name',
    dataKey: 'warehouseName',
    validation: (getI18nText) => ({
      required: getI18nText('name', 'required'),
    })
  },
  [
    {
      id: 'user',
      dataKey: 'userAccountId',
      type: "select",
      options: undefined,
      validation: (getI18nText) => ({
        required: getI18nText('user', 'required'),
      })
    },
    {
      id: 'fee',
      dataKey: 'fee',
      props: {
        type: 'number',
        InputProps: {
          endAdornment: <InputAdornment position="end">%</InputAdornment>
        }
      },
      validation: (getI18nText) => ({
        required: getI18nText('fee', 'required'),
      }),
    },
  ],
  {
    id: 'address',
    dataKey: 'warehouseAddress',
    validation: (getI18nText) => ({
      required: getI18nText('address', 'required'),
    }),
  },
  {
    id: 'notes',
    dataKey: 'notes'
  },
];

// ----------------------------------------------------------------------
WarehouseEdit.propTypes = {
  relation: PropTypes.array,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  defaultValues: PropTypes.object, // 表单默认值
  onSubmit: PropTypes.func,
};

export default function WarehouseEdit({
  relation,
  open,
  defaultValues = {
    warehouseName: '',
    userAccountId: '',
    fee: '',
    warehouseAddress: '',
    notes: '',
  },
  onSubmit,
  onClose,
}) {
  const { getI18nText } = useLocales('sections.storeManage.warehouseEdit');
  const [formConfig, setFormConfig] = useState();

  useEffect(() => {
    // 选项注入
    if (relation) {
      const options = relation.map(v => ({
        label: v.name,
        value: v.id,
      }))
      let isFound = false;
      for (let i = 0, len = FORM_CONFIG.length; i < len; i += 1) {
        const group = FORM_CONFIG[i];
        if (Object.prototype.toString.call(group) === '[object Array]') {
          for (let c = 0, cLen = group.length; c < cLen; c += 1) {
            if (group[c].id === 'user') {
              group[c].options = options;
              isFound = true;
              break;
            }
          }
        } else if (group.id === 'user') {
          group.options = options;
          isFound = true;
        }
        if (isFound) break;
      }
      setFormConfig(FORM_CONFIG);
    }
  }, [relation, formConfig]);

  if (!formConfig) return null;

  return <DialogForm open={open}
    title={getI18nText(defaultValues ? 'edit' : 'add', 'title')}
    formConfig={formConfig}
    defaultValues={defaultValues}
    getI18nText={getI18nText}
    onSubmit={(value) => {
      value.fee = Number(value.fee);
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