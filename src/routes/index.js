import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
// import MainLayout from 'src/layouts/main';
import DashboardLayout from 'src/layouts/dashboard';
import LogoOnlyLayout from 'src/layouts/LogoOnlyLayout';
// guards
import GuestGuard from 'src/guards/GuestGuard';
import AuthGuard from 'src/guards/AuthGuard';
// import RoleBasedGuard from 'src/guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from 'src/config';
// components
import LoadingScreen from 'src/components/LoadingScreen';


// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        // { path: 'login-unprotected', element: <Login /> },
        // { path: 'register-unprotected', element: <Register /> },
        // { path: 'reset-password', element: <ResetPassword /> },
        // { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        // { path: 'ecommerce', element: <GeneralEcommerce /> },
        // { path: 'analytics', element: <GeneralAnalytics /> },
        // { path: 'banking', element: <GeneralBanking /> },
        // { path: 'booking', element: <GeneralBooking /> },
        {
          path:'caiGou',
          children: [
            // ??????
            { path: 'cgdd', element: <CaigouOrder /> },// ????????????
            { path: 'cgrk', element: <CaigouRuku /> },// ????????????
            { path: 'cgth', element: <CaigouReturn /> }, // ????????????
          ]
        },
        {
          path:'lingShou',
          children: [
            // ??????
            { path: 'lsck', element: <LingShouChuku /> },// ????????????
            { path: 'lsth', element: <LingShouReturn /> }, // ????????????
          ]
        },
        // ????????????
        {
          path:'storeManage',
          children: [
            { path: 'transfer', element: <TransferInfo /> },// ????????????
            { path: 'warehouse', element: <WarehouseInfo /> }, // ????????????
            { path: 'shelves', element: <ShelvesInfo /> }, // ????????????
          ]
        },
        // ????????????
        {
          path:'stockManage',
          children: [
            { path: 'stock', element: <StockInfo /> },// ????????????
            { path: 'defects', element: <StockDefects /> }, // ????????????
            { path: 'in', element: <StockIn /> }, // ????????????
            { path: 'sell', element: <StockSell /> },// ????????????
            { path: 'transfer', element: <StockTransfer /> }, // ????????????
          ]
        },
        {
          path:'orderManage',
          children: [
            //  ????????????
            { path: 'ddlb', element: <OrderList /> },// ????????????
            { path: 'thgl', element: <ReturnManage /> }, // ????????????
          ]
        },
        {
          path:'systemManage',
          children: [
            //  ????????????
            { path: 'rzgl', element: <LogManage /> },// ????????????
            { path: 'jsgl', element: <RoleManage /> }, // ????????????
            { path: 'yhgl', element: <UserManage /> },// ????????????
          ]
        },

        // {
        //   path: 'e-commerce',
        //   children: [
        //     { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
        //     { path: 'shop', element: <EcommerceShop /> },
        //     { path: 'product/:name', element: <EcommerceProductDetails /> },

        //     { path: 'product/new', element: <EcommerceProductCreate /> },
        //     { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
        //     { path: 'checkout', element: <EcommerceCheckout /> },
        //     { path: 'invoice', element: <EcommerceInvoice /> },
        //   ],
        // },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            // { path: 'profile', element: <UserProfile /> },
            // { path: 'cards', element: <UserCards /> },
            // { path: 'list', element: <UserList /> },
            // { path: 'new', element: <UserCreate /> },
            // { path: ':name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        // {
        //   path: 'blog',
        //   children: [
        //     { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
        //     { path: 'posts', element: <BlogPosts /> },
        //     { path: 'post/:title', element: <BlogPost /> },
        //     { path: 'new-post', element: <BlogNewPost /> },
        //   ],
        // },
        // {
        //   path: 'mail',
        //   children: [
        //     { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
        //     { path: 'label/:customLabel', element: <Mail /> },
        //     { path: 'label/:customLabel/:mailId', element: <Mail /> },
        //     { path: ':systemLabel', element: <Mail /> },
        //     { path: ':systemLabel/:mailId', element: <Mail /> },
        //   ],
        // },
        // {
        //   path: 'chat',
        //   children: [
        //     { element: <Chat />, index: true },
        //     { path: 'new', element: <Chat /> },
        //     { path: ':conversationKey', element: <Chat /> },
        //   ],
        // },
        // { path: 'calendar', element: <Calendar /> },
        // { path: 'kanban', element: <Kanban /> },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        // { path: 'pricing', element: <Pricing /> },
        // { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '403', element: <Forbidden /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    // {
    //   path: '/',
    //   element: <MainLayout />,
    //   children: [
    //     { element: <HomePage />, index: true },
    //     { path: 'about-us', element: <About /> },
    //     { path: 'contact-us', element: <Contact /> },
    //     { path: 'faqs', element: <Faqs /> },
    //   ],
    // },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('src/pages/auth/Login')));
const Register = Loadable(lazy(() => import('src/pages/auth/Register')));
// const ResetPassword = Loadable(lazy(() => import('src/pages/auth/ResetPassword')));
// const VerifyCode = Loadable(lazy(() => import('src/pages/auth/VerifyCode')));
// Dashboard
const GeneralApp = Loadable(lazy(() => import('src/pages/dashboard/GeneralApp')));
// const GeneralEcommerce = Loadable(lazy(() => import('src/pages/dashboard/GeneralEcommerce')));
// const GeneralAnalytics = Loadable(lazy(() => import('src/pages/dashboard/GeneralAnalytics')));
// const GeneralBanking = Loadable(lazy(() => import('src/pages/dashboard/GeneralBanking')));
// const GeneralBooking = Loadable(lazy(() => import('src/pages/dashboard/GeneralBooking')));
// const EcommerceShop = Loadable(lazy(() => import('src/pages/dashboard/EcommerceShop')));
// const EcommerceProductDetails = Loadable(lazy(() => import('src/pages/dashboard/EcommerceProductDetails')));
// const EcommerceProductList = Loadable(lazy(() => import('src/pages/dashboard/EcommerceProductList')));
// ??????
const CaigouOrder = Loadable(lazy(() => import('src/pages/caigou/caigouOrder/caigouOrder')));
const CaigouRuku = Loadable(lazy(() => import('src/pages/caigou/caigouRuKu/caigouRuKu')));
const CaigouReturn = Loadable(lazy(() => import('src/pages/caigou/caigouReturn/caigouReturn')));
// ????????????
const LingShouChuku = Loadable(lazy(() => import('src/pages/ls/lsck/lsck')));
const LingShouReturn = Loadable(lazy(() => import('src/pages/ls/lsth/lsth')));
// ????????????
const TransferInfo = Loadable(lazy(() => import('src/pages/storeManage/Transfer')));
const WarehouseInfo = Loadable(lazy(() => import('src/pages/storeManage/Warehouse')));
const ShelvesInfo = Loadable(lazy(() => import('src/pages/storeManage/Shelves')));
// ????????????
const StockInfo = Loadable(lazy(() => import('src/pages/stockManage/Stock')));
const StockDefects = Loadable(lazy(() => import('src/pages/stockManage/Defects')));
const StockIn = Loadable(lazy(() => import('src/pages/stockManage/StockIn')));
const StockSell = Loadable(lazy(() => import('src/pages/stockManage/StockSell')));
const StockTransfer = Loadable(lazy(() => import('src/pages/stockManage/Transfer')));

const OrderList = Loadable(lazy(() => import('src/pages/orderManage/orderList/orderList')));
const ReturnManage = Loadable(lazy(() => import('src/pages/orderManage/returnManage/returnManage')));
const LogManage = Loadable(lazy(() => import('src/pages/systemManage/logManage/logManage')));
const RoleManage = Loadable(lazy(() => import('src/pages/systemManage/roleManage/roleManage')));
const UserManage = Loadable(lazy(() => import('src/pages/systemManage/userManage/userManage')));
// const EcommerceProductCreate = Loadable(lazy(() => import('src/pages/dashboard/EcommerceProductCreate')));
// const EcommerceCheckout = Loadable(lazy(() => import('src/pages/dashboard/EcommerceCheckout')));
// const EcommerceInvoice = Loadable(lazy(() => import('src/pages/dashboard/EcommerceInvoice')));
// const BlogPosts = Loadable(lazy(() => import('src/pages/dashboard/BlogPosts')));
// const BlogPost = Loadable(lazy(() => import('src/pages/dashboard/BlogPost')));
// const BlogNewPost = Loadable(lazy(() => import('src/pages/dashboard/BlogNewPost')));
// const UserProfile = Loadable(lazy(() => import('src/pages/dashboard/UserProfile')));
// const UserCards = Loadable(lazy(() => import('src/pages/dashboard/UserCards')));
// const UserList = Loadable(lazy(() => import('src/pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('src/pages/dashboard/UserAccount')));
// const UserCreate = Loadable(lazy(() => import('src/pages/dashboard/UserCreate')));
// const Chat = Loadable(lazy(() => import('src/pages/dashboard/Chat')));
// const Mail = Loadable(lazy(() => import('src/pages/dashboard/Mail')));
// const Calendar = Loadable(lazy(() => import('src/pages/dashboard/Calendar')));
// const Kanban = Loadable(lazy(() => import('src/pages/dashboard/Kanban')));
// Main
// const HomePage = Loadable(lazy(() => import('src/pages/Home')));
// const About = Loadable(lazy(() => import('src/pages/About')));
// const Contact = Loadable(lazy(() => import('src/pages/Contact')));
// const Faqs = Loadable(lazy(() => import('src/pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('src/pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('src/pages/Maintenance')));
// const Pricing = Loadable(lazy(() => import('src/pages/Pricing')));
// const Payment = Loadable(lazy(() => import('src/pages/Payment')));
const Page500 = Loadable(lazy(() => import('src/pages/Page500')));
const NotFound = Loadable(lazy(() => import('src/pages/Page404')));
const Forbidden = Loadable(lazy(() => import('src/pages/Page403')));
