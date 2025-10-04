import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_ADDRESSES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface DeleteAccountAddressParams extends MutationParams {
  accountId: string;
  addressId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const DeleteAccountAddress = async ({
  accountId,
  addressId,
  adminApiParams,
  queryClient,
}: DeleteAccountAddressParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/accounts/${accountId}/addresses/${addressId}`
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
  >(DeleteAccountAddress, options);
};
