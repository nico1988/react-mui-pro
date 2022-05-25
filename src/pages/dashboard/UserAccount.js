import { capitalCase } from 'change-case';
import { useCallback, useEffect, useMemo, useState } from 'react';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
import useLocales from '../../hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  AccountGeneral,
  AccountBilling,
  AccountChangePassword,
} from '../../sections/@dashboard/user/account';

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();
  const { getI18nText } = useLocales('pages.dashboard.userAccount');

  const [currentTab, setCurrentTab] = useState('general');
  const [title, setTitle] = useState({
    page: '',
    pageRoot: '',
  });

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral />,
    },
    {
      value: 'billing',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: <AccountBilling />,
    },
    {
      value: 'changePassword',
      icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
  ];

  const getTabTitle = useCallback((key) => getI18nText(key, 'tabs'), [getI18nText]);
  
  useEffect(() => {
    if (getI18nText) {
      setTitle({
        pageRoot: getI18nText('user', 'menu', undefined, ''),
        page: getI18nText('userAccount', 'menu', undefined, ''),
      })
    }
  }, [getI18nText]);

  return (
    <Page title={`${title.pageRoot}: ${title.page}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {useMemo(() => <HeaderBreadcrumbs
          heading={title.page}
          links={[
            { name: title.pageRoot },
            { name: title.page, href: PATH_DASHBOARD.user.account },
            { name: getTabTitle(currentTab) },
          ]}
        />, [title, getTabTitle, currentTab])}

        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={(e, value) => setCurrentTab(value)}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={getTabTitle(tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
