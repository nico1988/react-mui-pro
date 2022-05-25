import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// route
import { PATH_PAGE, PATH_DASHBOARD } from 'src/routes/paths';
import Marks from 'src/routes/mark';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { clearAccount } from 'src/redux/slices/account';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized, user, isSub } = useAuth();
  const { pathname } = useLocation();
  const [ requestedLocation, setRequestedLocation ] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    dispatch(clearAccount());
    // 记录当前页面
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    if (user && !user.vip) {
      return <Register />
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  // 子账号没权进首页, 如果去首页, 直接跳有授权的第一个页面
  if (isSub && pathname === PATH_DASHBOARD.general.app) {
    const firstPage = user?.menus[0];
    const pages = Object.keys(Marks);
    for (let i = 0, len = pages.length; i < len; i += 1) {
      const page = pages[i];
      if (Marks[page].includes(firstPage)) return <Navigate to={page} />
    }
  }

  // 判断是否要去的页面是否有权限
  if (Marks[pathname] && !Marks[pathname].some(v => user?.menus?.includes(v))) {
    return <Navigate to={PATH_PAGE.page403} />
  }

  return <>{children}</>;
}
