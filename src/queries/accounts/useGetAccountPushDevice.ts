import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, PushDevice } from "@src/interfaces";

import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_PUSH_DEVICES_QUERY_KEY } from "./useGetAccountPushDevices";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_PUSH_DEVICE_QUERY_KEY = (
  accountId: string,
  pushDeviceId: string
) => [...ACCOUNT_PUSH_DEVICES_QUERY_KEY(accountId), pushDeviceId];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_PUSH_DEVICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_PUSH_DEVICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountPushDevice>>
) => {
  client.setQueryData(ACCOUNT_PUSH_DEVICE_QUERY_KEY(...keyParams), response);
};

interface GetAccountPushDeviceProps extends SingleQueryParams {
  accountId: string;
  pushDeviceId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountPushDevice = async ({
  accountId = "",
  pushDeviceId = "",
  adminApiParams,
}: GetAccountPushDeviceProps): Promise<ConnectedXMResponse<PushDevice>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/accounts/${accountId}/push-devices/${pushDeviceId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccountPushDevice = (
  accountId: string = "",
  pushDeviceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccountPushDevice>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAccountPushDevice>>(
    ACCOUNT_PUSH_DEVICE_QUERY_KEY(accountId, pushDeviceId),
    (params: SingleQueryParams) =>
      GetAccountPushDevice({ accountId, pushDeviceId, ...params }),
    {
      ...options,
      enabled: !!accountId && !!pushDeviceId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
