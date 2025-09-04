import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, PushDevice } from "@src/interfaces";

import { QueryClient } from "@tanstack/react-query";
import { PUSH_DEVICES_QUERY_KEY } from "./useGetPushDevices";

/**
 * @category Keys
 * @group Accounts
 */
export const PUSH_DEVICE_QUERY_KEY = (pushDeviceId: string) => [
  ...PUSH_DEVICES_QUERY_KEY(),
  pushDeviceId,
];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_PUSH_DEVICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PUSH_DEVICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPushDevice>>
) => {
  client.setQueryData(PUSH_DEVICE_QUERY_KEY(...keyParams), response);
};

interface GetPushDeviceProps extends SingleQueryParams {
  pushDeviceId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetPushDevice = async ({
  pushDeviceId = "",
  adminApiParams,
}: GetPushDeviceProps): Promise<ConnectedXMResponse<PushDevice>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/push-devices/${pushDeviceId}`);
  return data;
};
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetPushDevice = (
  pushDeviceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetPushDevice>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetPushDevice>>(
    PUSH_DEVICE_QUERY_KEY(pushDeviceId),
    (params: SingleQueryParams) => GetPushDevice({ pushDeviceId, ...params }),
    {
      ...options,
      enabled: !!pushDeviceId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
