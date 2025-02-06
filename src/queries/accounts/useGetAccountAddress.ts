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
 * Retrieves a specific account address using the account ID and address ID.
 * This function is designed to fetch detailed information about an account's address, 
 * which can be used in applications requiring precise address data for a given account.
 * @name GetAccountAddress
 * @param {string} accountId (path) - The id of the account
 * @param {string} addressId (path) - The id of the address
 * @version 1.3
 **/

export const ACCOUNT_ADDRESS_QUERY_KEY = (
  accountId: string,
  addressId: string
) => [...ACCOUNT_ADDRESSES_QUERY_KEY(accountId), addressId];

interface GetAccountAddressProps extends SingleQueryParams {
  accountId: string;
  addressId: string;
}

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
    },
    "accounts"
  );
};