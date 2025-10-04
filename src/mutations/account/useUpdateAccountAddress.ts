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
 * @category Params
 * @group Account
 */
export interface UpdateAccountAddressParams extends MutationParams {
  accountId: string;
  addressId: string;
  address: AccountAddressUpdateInputs;
}

/**
 * @category Methods
 * @group Account
 */
export const UpdateAccountAddress = async ({
  accountId,
  addressId,
  address,
  adminApiParams,
  queryClient,
}: UpdateAccountAddressParams): Promise<
  ConnectedXMResponse<AccountAddress>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<AccountAddress>>(
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
  >(UpdateAccountAddress, options);
};
