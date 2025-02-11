import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_ADDRESSES_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific address associated with an account.
 * This function allows for the removal of an address from an account by specifying the account and address IDs.
 * It is intended for use in applications where account address management is required.
 * @name DeleteAccountAddress
 * @param {string} accountId (path) The id of the account
 * @param {string} addressId (path) The id of the address
 * @version 1.3
 **/
export interface DeleteAccountAddressParams extends MutationParams {
  accountId: string;
  addressId: string;
}

export const DeleteAccountAddress = async ({
  accountId,
  addressId,
  adminApiParams,
  queryClient,
}: DeleteAccountAddressParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/accounts/${accountId}/addresses/${addressId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_ADDRESSES_QUERY_KEY(accountId),
    });
  }

  return data;
};

export const useDeleteAccountAddress = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteAccountAddress>>,
      Omit<DeleteAccountAddressParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAccountAddressParams,
    Awaited<ReturnType<typeof DeleteAccountAddress>>
  >(DeleteAccountAddress, options, {
    domain: "accounts",
    type: "update",
  });
};
