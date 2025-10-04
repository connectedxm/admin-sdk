import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";

import { AccountAddress } from "@src/interfaces";
import { ACCOUNT_ADDRESSES_QUERY_KEY } from "./useGetAccountAddresses";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_ADDRESS_QUERY_KEY = (
  accountId: string,
  addressId: string
) => [...ACCOUNT_ADDRESSES_QUERY_KEY(accountId), addressId];

interface GetAccountAddressProps extends SingleQueryParams {
  accountId: string;
  addressId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountAddress = async ({
  accountId,
  addressId,
  adminApiParams,
}: GetAccountAddressProps): Promise<ConnectedXMResponse<AccountAddress>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/accounts/${accountId}/addresses/${addressId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccountAddress = (
  accountId: string = "",
  addressId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccountAddress>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAccountAddress>>(
    ACCOUNT_ADDRESS_QUERY_KEY(accountId, addressId),
    (params: SingleQueryParams) =>
      GetAccountAddress({ accountId: accountId, addressId, ...params }),
    {
      ...options,
      enabled: !!accountId && !!addressId && (options?.enabled ?? true),
    }
  );
};
