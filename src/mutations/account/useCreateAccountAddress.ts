import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_ADDRESSES_QUERY_KEY } from "@src/queries";
import { AddressCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Account
 */
export interface CreateAccountAddressParams extends MutationParams {
  accountId: string;
  addressId: string;
  address: AddressCreateInputs;
}

/**
 * @category Methods
 * @group Account
 */
export const CreateAccountAddress = async ({
  accountId,
  addressId,
  address,
  adminApiParams,
  queryClient,
}: CreateAccountAddressParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/addresses/${addressId}`,
    address
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_ADDRESSES_QUERY_KEY(accountId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useCreateAccountAddress = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateAccountAddress>>,
      Omit<CreateAccountAddressParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAccountAddressParams,
    Awaited<ReturnType<typeof CreateAccountAddress>>
  >(CreateAccountAddress, options, {
    domain: "accounts",
    type: "update",
  });
};
