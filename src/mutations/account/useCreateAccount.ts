import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ACCOUNTS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Params
 * @group Account
 */
export interface CreateAccountParams extends MutationParams {
  account: {
    // REQUIRED
    accountType: "account" | "team";
    email: string;
    username: string;
    // OPTIONAL
    featured?: boolean;
    firstName?: string | null;
    lastName?: string | null;
    imageId?: string | null;
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
export const CreateAccount = async ({
  account,
  adminApiParams,
  queryClient,
}: CreateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Account>>(
    `/accounts`,
    account
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
    SET_ACCOUNT_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useCreateAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateAccount>>,
      Omit<CreateAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAccountParams,
    Awaited<ReturnType<typeof CreateAccount>>
  >(CreateAccount, options);
};
