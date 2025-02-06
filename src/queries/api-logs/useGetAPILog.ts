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
 * Endpoint to retrieve details of a specific API log entry by its unique identifier.
 * This function allows users to fetch comprehensive information about a particular API log entry.
 * It is designed for applications that require detailed logging information for auditing or debugging purposes.
 * @name GetAPILog
 * @param {string} logId (path) - The id of the log entry
 * @version 1.3
 **/

export const API_LOG_QUERY_KEY = (logId: string) => [
  ...API_LOGS_QUERY_KEY(),
  logId,
];

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

export const GetAPILog = async ({
  logId,
  adminApiParams,
}: GetAPILogParams): Promise<ConnectedXMResponse<APILog>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logs/api/${logId}`);

  return data;
};

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
    },
    "org"
  );
};