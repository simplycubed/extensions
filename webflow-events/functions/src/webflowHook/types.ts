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

export interface UserAccountUpdatedPayload {
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

export interface EcommNewOrder {
  orderId: string;
  [key: string]: any;
}

export interface EcommOrderChanged {
  orderId: string;
  [key: string]: any;
}

export interface EcommInventoryChanged {
  _id: string;
  quantity: number;
  inventoryType: "finite" | "infinite";
}

export interface CollectionItemCreated {
  _cid: string;
  _id: string;
  [key: string]: any;
}

export interface CollectionItemChanged {
  _cid: string;
  _id: string;
  [key: string]: any;
}

export interface CollectionItemDeleted {
  deleted: number;
  itemId: string;
}

export interface CollectionItemUnpublished {
  deleted: number;
  itemId: string;
}

export interface FormSubmissionPayload {
  _id: string;
  [key: string]: any;
}

export interface SitePublishPayload {
  site: string;
  [key: string]: any;
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
  form_submission = "form_submission",
  site_publish = "site_publish",
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
    [TriggerType.form_submission]: "formSubmission",
    [TriggerType.site_publish]: "sitePublish",
  };
