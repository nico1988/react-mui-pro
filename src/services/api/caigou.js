export default {
  LIST:'purchase-order/list',
  GOODS_LIST:'shoe/list',
  SAVE_ADD:'purchase-order',// 采购入库
  AUDIT:'purchase-order/audit',// 审核
  REVERT_AUDIT:'purchase-order/revert-audit',// 反审核
  OPERATOR:'accounts',// 操作员下拉
  BARCODE_SEARCH:'shoe/barcode' ,// 通过条形码查询
  RuKu:{
    LIST:'purchase-inventory-order/list', // 采购入库列表
    ADD: 'purchase-inventory-order',// 增删查改
    AUDIT:'purchase-inventory-order/audit',// 审核
    REVERT_AUDIT:'purchase-inventory-order/revert-audit',// 反审核

  },
  // 采购退货
  Return:{
    LIST:'purchase-returns-order/list', // 采购退货列表
    ADD: 'purchase-returns-order',// 增删查改
    AUDIT:'purchase-returns-order/audit',// 审核
    REVERT_AUDIT:'purchase-returns-order/revert-audit',// 反审核
  },
  Store:{
    LIST:'warehouse/list',// 仓库列表
  },
  Shelf:{
    LIST:'shelf/list',// 货架列表
  }
}

