import React, { Component, useState } from 'react'
import { Box, Typography, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import useLocales from '../../../hooks/useLocales';

import p1 from '../../../assets/images/reg/p1.png'
import p2 from '../../../assets/images/reg/p2.png'

import p3 from '../../../assets/images/reg/p3.png'

import p4 from '../../../assets/images/reg/p4.png'

import p5 from '../../../assets/images/reg/p5.png'

import p6 from '../../../assets/images/reg/p6.png'
import Image from '../../../components/Image';

const regType = [
  {
    key: 'PERSONAL',
    imgD: p1,
    imgL: p2
  },
  {
    key: 'ENTERPRISE',
    imgD: p3,
    imgL: p4
  },
  {
    key: 'GENERAL',
    imgD: p5,
    imgL: p6
  },
]

const Reg2 = (props) => {
  const { isSubmitting, onSubmit } = props; 
  const theme = useTheme();
  const { getI18nText } = useLocales('sections.auth.register');
  const [select, setSelect] = useState('PERSONAL');

  return <>
    <Box sx={{ display: 'flex', alignItems: 'center', margin: '0 -0.13%' }}>
      {regType.map((v, index) => <Box sx={{
        pl: index ? '4%' : '3.3%',
        pr: index !== 2 ? '4%' : '3.3%',
        textAlign: 'center',
      }} key={v.key}
        onClick={() => setSelect(v.key)}>
        <Image sx={{ width: '100%' }} src={select !== v.key ? v.imgD : v.imgL} />
        <Typography sx={{
          fontWeight: 'bold',
          mt: '8px',
          color: theme.palette.text.primary
        }} variant="subtitle1">{getI18nText(v.key, 'userType.name')}</Typography>
        <Typography sx={{
          color: theme.palette.text.secondary
        }} variant="subtitle2">({getI18nText(v.key, 'userType.tips')})</Typography>
      </Box>)}
    </Box>
    <Alert severity="info" sx={{ mt: 3 }}>
      {getI18nText('typeTips', 'text')}
    </Alert>
    <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} 
      onClick={() => onSubmit(select)}
      sx={{
        mt: 3,
      }}>
      {getI18nText('register', 'button')}
    </LoadingButton>
  </>
}

export default Reg2
