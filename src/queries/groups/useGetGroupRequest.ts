import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { GroupRequest } from "@src/interfaces";
import { GROUP_REQUESTS_QUERY_KEY } from "./useGetGroupRequests";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Groups
 */
export const GROUP_REQUEST_QUERY_KEY = (groupId: string, requestId: string) => [
  ...GROUP_REQUESTS_QUERY_KEY(groupId),
  requestId,
];

/**
 * @category Setters
 * @group Groups
 */
export const SET_GROUP_REQUEST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_REQUEST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupRequest>>
) => {
  client.setQueryData(GROUP_REQUEST_QUERY_KEY(...keyParams), response);
};

interface GetGroupRequestProps extends SingleQueryParams {
  groupId: string;
  requestId: string;
}

/**
 * @category Queries
 * @group Groups
 */
export const GetGroupRequest = async ({
  groupId,
  requestId,
  adminApiParams,
}: GetGroupRequestProps): Promise<ConnectedXMResponse<GroupRequest>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/groups/${groupId}/requests/${requestId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Groups
 */
export const useGetGroupRequest = (
  groupId: string = "",
  requestId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetGroupRequest>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroupRequest>>(
    GROUP_REQUEST_QUERY_KEY(groupId, requestId),
    (params: SingleQueryParams) =>
      GetGroupRequest({ groupId, requestId, ...params }),
    {
      ...options,
      enabled: !!groupId && !!requestId && (options?.enabled ?? true),
    },
    "groups"
  );
};
