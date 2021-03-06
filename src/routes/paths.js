// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
// const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_DASHBOARD = '';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  // loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  // registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  // resetPassword: path(ROOTS_AUTH, '/reset-password'),
  // verify: path(ROOTS_AUTH, '/verify')
}

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  // pricing: '/pricing',
  // payment: '/payment',
  // about: '/about-us',
  // contact: '/contact-us',
  // faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: '/',
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    // ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    // analytics: path(ROOTS_DASHBOARD, '/analytics'),
    // banking: path(ROOTS_DASHBOARD, '/banking'),
    // booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  // mail: {
  //   root: path(ROOTS_DASHBOARD, '/mail'),
  //   all: path(ROOTS_DASHBOARD, '/mail/all')
  // },
  // chat: {
  //   root: path(ROOTS_DASHBOARD, '/chat'),
  //   new: path(ROOTS_DASHBOARD, '/chat/new'),
  //   conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey')
  // },
  // calendar: path(ROOTS_DASHBOARD, '/calendar'),
  // kanban: path(ROOTS_DASHBOARD, '/kanban'),
  // eCommerce: {
  //   root: path(ROOTS_DASHBOARD, '/e-commerce'),
  //   shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
  //   product: path(ROOTS_DASHBOARD, '/e-commerce/product/:name'),
  //   productById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  //   newProduct: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
  //   editById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
  //   checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
  //   invoice: path(ROOTS_DASHBOARD, '/e-commerce/invoice')
  // },

  caiGou:{
    root: path(ROOTS_DASHBOARD, '/caiGou'),
    cgdd: path(ROOTS_DASHBOARD, '/caiGou/cgdd'),// ????????????
    cdrk: path(ROOTS_DASHBOARD, '/caiGou/cgrk'),//  ????????????
    cgth: path(ROOTS_DASHBOARD, '/caiGou/cgth'),// ????????????
  },
  lingShou:{
    // ??????
    root: path(ROOTS_DASHBOARD, '/lingShou'),
    lsck:path(ROOTS_DASHBOARD, '/lingShou/lsck'), // ????????????
    lsth:path(ROOTS_DASHBOARD, '/lingShou/lsth'), // ????????????
  },
  //  ????????????
  storeManage:{
    root: path(ROOTS_DASHBOARD, '/storeManage'),
    transfer: path(ROOTS_DASHBOARD, '/storeManage/transfer'), // ????????????
    warehouse: path(ROOTS_DASHBOARD, '/storeManage/warehouse'), // ????????????
    shelves: path(ROOTS_DASHBOARD, '/storeManage/shelves'), // ????????????
  },
  //  ????????????
  stockManage:{
    root: path(ROOTS_DASHBOARD, '/stockManage'),
    stock: path(ROOTS_DASHBOARD, '/stockManage/stock'), // ????????????
    defects: path(ROOTS_DASHBOARD, '/stockManage/defects'), // ????????????
    in: path(ROOTS_DASHBOARD, '/stockManage/in'), // ????????????
    sell: path(ROOTS_DASHBOARD, '/stockManage/sell'), // ????????????
    transfer: path(ROOTS_DASHBOARD, '/stockManage/transfer'), // ????????????
  },
  orderManage:{
    //  ????????????
    root: path(ROOTS_DASHBOARD, '/orderManage'),
    ddlb:path(ROOTS_DASHBOARD, '/orderManage/ddlb'), // ????????????
    thgl:path(ROOTS_DASHBOARD, '/orderManage/thgl'), // ????????????
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    // profile: path(ROOTS_DASHBOARD, '/user/profile'),
    // cards: path(ROOTS_DASHBOARD, '/user/cards'),
    // list: path(ROOTS_DASHBOARD, '/user/list'),
    // newUser: path(ROOTS_DASHBOARD, '/user/new'),
    // editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  systemManage:{
    //  ????????????
    root: path(ROOTS_DASHBOARD, '/systemManage'),
    rzgl:path(ROOTS_DASHBOARD, '/systemManage/rzgl'), // ????????????
    jsgl:path(ROOTS_DASHBOARD, '/systemManage/jsgl'), // ????????????
    yhgl:path(ROOTS_DASHBOARD, '/systemManage/yhgl'), // ????????????
  },

  // blog: {
  //   root: path(ROOTS_DASHBOARD, '/blog'),
  //   posts: path(ROOTS_DASHBOARD, '/blog/posts'),
  //   post: path(ROOTS_DASHBOARD, '/blog/post/:title'),
  //   postById: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  //   newPost: path(ROOTS_DASHBOARD, '/blog/new-post')
  // }
};

export const PATH_DOCS = 'https://www.go-pro.cn';
