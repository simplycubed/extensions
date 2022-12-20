export interface UserAccountAddedPayload {
  _id: string;
  createdOn: string;
  updatedOn: string;
  emailVerified: boolean;
  status: string;
  invitedOn?: string;
  lastLogin?: string;
  data: {
    "accept-privacy": boolean;
    "accept-communications": boolean;
    email: string;
    name: string;
  };
}

export enum TriggerType {
  memberships_user_account_added = "memberships_user_account_added",
  memberships_user_account_updated = "memberships_user_account_updated",
  collection_item_created = "collection_item_created",
  collection_item_changed = "collection_item_changed",
  collection_item_deleted = "collection_item_deleted",
  collection_item_unpublished = "collection_item_unpublished",
  ecomm_new_order = "ecomm_new_order",
  ecomm_order_changed = "ecomm_order_changed",
  ecomm_inventory_changed = "ecomm_inventory_changed",
}

export const triggerTypeEndpointMap: { [triggerType in TriggerType]: string } =
  {
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
