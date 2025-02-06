import { AccountAddress, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_ADDRESSES_QUERY_KEY } from "@src/queries";
import { AccountAddressUpdateInputs } from "@src/params";

/**
 * Endpoint to update the address of a specified account.
 * This function allows updating the address details of a specific account by providing the account ID and address ID.
 * It is designed to be used in applications where account address management is required.
 * @name UpdateAccountAddress
 * @param {string} accountId (path) - The id of the account
 * @param {string} addressId (path) - The id of the address
 * @param {AccountAddressUpdateInputs} address (body) - The new address details
 * @version 1.3
 **/
export interface UpdateAccountAddressParams extends MutationParams {
  accountId: string;
  addressId: string;
  address: AccountAddressUpdateInputs;
}

export const UpdateAccountAddress = async ({
  accountId,
  addressId,
  address,
  adminApiParams,
  queryClient,
}: UpdateAccountAddressParams): Promise<
  ConnectedXMResponse<AccountAddress>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<AccountAddress>>(
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

export const useUpdateAccountAddress = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAccountAddress>>,
      Omit<UpdateAccountAddressParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAccountAddressParams,
    Awaited<ReturnType<typeof UpdateAccountAddress>>
  >(UpdateAccountAddress, options, {
    domain: "accounts",
    type: "update",
  });
};