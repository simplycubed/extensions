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
