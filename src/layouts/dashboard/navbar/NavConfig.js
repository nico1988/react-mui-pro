// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import Marks from '../../../routes/mark';

// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: '数据大盘', path: PATH_DASHBOARD.general.app, icon: ICONS.analytics }],
  },
  // 主业务流程
  // ----------------------------------------------------------------------
  {
    subheader: 'main',
    items: [
      {
        title: '采购管理',
        icon: ICONS.cart,
        path: PATH_DASHBOARD.caiGou.root,
        children: [
          { title: '采购订单', path: PATH_DASHBOARD.caiGou.cgdd },
          { title: '采购入库', path: PATH_DASHBOARD.caiGou.cdrk },
          { title: '采购退货', path: PATH_DASHBOARD.caiGou.cgth },
        ],
      },
      {
        title: '零售管理',
        path: PATH_DASHBOARD.lingShou.root,
        icon: ICONS.user,
        children: [
          { title: '零售出库', path: PATH_DASHBOARD.lingShou.lsck },
          { title: '零售退货', path: PATH_DASHBOARD.lingShou.lsth },
        ],
      },
      {
        title: 'storeManage',
        path: PATH_DASHBOARD.storeManage.root,
        icon: ICONS.blog,
        children: [
          { title: 'storeManageTransfer', path: PATH_DASHBOARD.storeManage.transfer },
          { title: 'storeManageWarehouse', path: PATH_DASHBOARD.storeManage.warehouse },
          { title: 'storeManageShelves', path: PATH_DASHBOARD.storeManage.shelves },
        ],
      },
      {
        title: 'stockManage',
        path: PATH_DASHBOARD.stockManage.root,
        icon: ICONS.dashboard,
        children: [
          { title: 'stockManageStock', path: PATH_DASHBOARD.stockManage.stock },
          { title: 'stockManageDefects', path: PATH_DASHBOARD.stockManage.defects },
          { title: 'stockManageIn', path: PATH_DASHBOARD.stockManage.in },
          { title: 'stockManageSell', path: PATH_DASHBOARD.stockManage.sell },
          { title: 'stockManageTransfer', path: PATH_DASHBOARD.stockManage.transfer },
        ],
      },
      {
        title: '订单管理',
        path: PATH_DASHBOARD.orderManage.root,
        icon: ICONS.ecommerce,
        children: [
          { title: '订单列表', path: PATH_DASHBOARD.orderManage.ddlb },
          { title: '退货管理', path: PATH_DASHBOARD.orderManage.thgl },
        ],
      },
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          // { title: 'profile', path: PATH_DASHBOARD.user.profile },
          // { title: 'cards', path: PATH_DASHBOARD.user.cards },
          // { title: 'list', path: PATH_DASHBOARD.user.list },
          // { title: 'create', path: PATH_DASHBOARD.user.newUser },
          // { title: 'edit', path: PATH_DASHBOARD.user.editById },
          { title: 'userAccount', path: PATH_DASHBOARD.user.account },
        ],
      },
      // MANAGEMENT : E-COMMERCE
      {
        title: '系统管理',
        path: PATH_DASHBOARD.systemManage.root,
        icon: ICONS.kanban,
        children: [
          { title: '日志管理', path: PATH_DASHBOARD.systemManage.rzgl },
          { title: '角色管理', path: PATH_DASHBOARD.systemManage.jsgl },
          { title: '用户管理', path: PATH_DASHBOARD.systemManage.yhgl },
        ],
      },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_DASHBOARD.mail.root,
  //       icon: ICONS.mail,
  //       info: (
  //         <Label variant="outlined" color="error">
  //           +32
  //         </Label>
  //       ),
  //     },
  //     { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
  //     { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
  //     {
  //       title: 'kanban',
  //       path: PATH_DASHBOARD.kanban,
  //       icon: ICONS.kanban,
  //     },
  //   ],
  // },
];

// menus 接口返回的可访问路径
export const getAuthNav = (menus) => {
  const result = [];
  for (let i = 0, len = navConfig.length; i < len; i += 1) {
    const { items = [], ...node } = navConfig[i];
    const newItems = [];
    for (let r = 0, rLen = items.length; r < rLen; r += 1) {
      const {path} = items[r];
      // 查看路径标识是否是否可访问
      if (path && Marks[path]) {
        const pathMark = Marks[path];
        const hasAuth = pathMark.some(v => menus.includes(v));
        if (hasAuth) newItems.push(items[r]);
      } else {
        newItems.push(items[r]);
      };
    }
    if (newItems.length) {
      node.items = newItems;
      result.push(node);
    }
  }

  console.log(result);
  return result;
}

export default navConfig;
