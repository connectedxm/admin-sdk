import { AccountAddress, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_ADDRESSES_QUERY_KEY } from "@src/queries";
import { AccountAddressCreateInputs } from "@src/params";

/**
 * Endpoint to create a new account address and invalidate related queries.
 * This function allows the creation of a new address for a specified account and ensures that any related cached queries are invalidated to maintain data consistency.
 * It is designed for use in applications where account address management is required.
 * @name CreateAccountAddress
 * @param {string} accountId - The id of the account
 * @param {AccountAddressCreateInputs} address - The address details to be created
 * @version 1.2
**/
export interface CreateAccountAddressParams extends MutationParams {
  accountId: string;
  address: AccountAddressCreateInputs;
}

export const CreateAccountAddress = async ({
  accountId,
  address,
  adminApiParams,
  queryClient,
}: CreateAccountAddressParams): Promise<
  ConnectedXMResponse<AccountAddress>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<AccountAddress>>(
    `/accounts/${accountId}/addresses`,
    address
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_ADDRESSES_QUERY_KEY(accountId),
    });
  }
  return data;
};

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