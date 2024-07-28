import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { APILog } from "@src/interfaces";
import { API_LOGS_QUERY_KEY } from "./useGetAPILogs";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Key
 * @group Emails
 */
export const API_LOG_QUERY_KEY = (logId: string) => [
  ...API_LOGS_QUERY_KEY(),
  logId,
];

/**
 * @category Setters
 * @group Emails
 */
export const SET_API_LOG_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof API_LOG_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAPILog>>
) => {
  client.setQueryData(API_LOG_QUERY_KEY(...keyParams), response);
};

interface GetAPILogParams extends SingleQueryParams {
  logId: string;
}

/**
 * @category Query
 * @group Emails
 */
export const GetAPILog = async ({
  logId,
  adminApiParams,
}: GetAPILogParams): Promise<ConnectedXMResponse<APILog>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logs/api/${logId}`);

  return data;
};

/**
 * @category Hooks
 * @group Emails
 */
export const useGetAPILog = (
  logId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAPILog>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAPILog>>(
    API_LOG_QUERY_KEY(logId),
    (params: SingleQueryParams) => GetAPILog({ logId, ...params }),
    {
      ...options,
      enabled: !!logId,
    }
  );
};
