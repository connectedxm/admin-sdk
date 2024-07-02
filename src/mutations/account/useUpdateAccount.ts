import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNTS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface UpdateAccountParams extends MutationParams {
  accountId: string;
  account: {
    accountType?: "account" | "team";
    featured?: boolean;
    verified?: boolean;
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
    imageId?: string | null;
    username?: string;
    phone?: string | null;
    title?: string | null;
    company?: string | null;
    bio?: string | null;
    website?: string | null;
    video?: string | null;
    facebook?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    tikTok?: string | null;
    linkedIn?: string | null;
    youtube?: string | null;
    discord?: string | null;
    dietaryRestrictions?: string | null;
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zip?: string | null;
    internalRefId?: string | null;
  };
}

/**
 * @category Methods
 * @group Account
 */
export const UpdateAccount = async ({
  accountId,
  account,
  adminApiParams,
  queryClient,
}: UpdateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}`,
    account
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useUpdateAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAccount>>,
      Omit<UpdateAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAccountParams,
    Awaited<ReturnType<typeof UpdateAccount>>
  >(UpdateAccount, options);
};
