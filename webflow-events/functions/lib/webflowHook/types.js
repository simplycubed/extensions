"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerTypeEndpointMap = exports.TriggerType = void 0;
var TriggerType;
(function (TriggerType) {
  TriggerType["memberships_user_account_added"] =
    "memberships_user_account_added";
  TriggerType["memberships_user_account_updated"] =
    "memberships_user_account_updated";
  TriggerType["collection_item_created"] = "collection_item_created";
  TriggerType["collection_item_changed"] = "collection_item_changed";
  TriggerType["collection_item_deleted"] = "collection_item_deleted";
  TriggerType["collection_item_unpublished"] = "collection_item_unpublished";
  TriggerType["ecomm_new_order"] = "ecomm_new_order";
  TriggerType["ecomm_order_changed"] = "ecomm_order_changed";
  TriggerType["ecomm_inventory_changed"] = "ecomm_inventory_changed";
})((TriggerType = exports.TriggerType || (exports.TriggerType = {})));
exports.triggerTypeEndpointMap = {
  [TriggerType.memberships_user_account_added]: "membershipsUserAccountAdded",
  [TriggerType.memberships_user_account_updated]:
    "membershipsUserAccountUpdated",
  [TriggerType.ecomm_new_order]: "ecommNewOrder",
  [TriggerType.ecomm_order_changed]: "ecommOrderChanged",
  [TriggerType.ecomm_inventory_changed]: "ecommInventoryChanged",
  [TriggerType.collection_item_created]: "collectionItemCreated",
  [TriggerType.collection_item_changed]: "collectionItemChanged",
  [TriggerType.collection_item_deleted]: "collectionItemDeleted",
  [TriggerType.collection_item_unpublished]: "collectionItemUnpublished",
};
