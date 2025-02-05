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
 * Endpoint to retrieve a specific group request by its unique identifiers.
 * This function allows users to fetch details of a particular group request using the provided group ID and request ID.
 * It is designed to be used in applications where detailed information about a group request is required.
 * @name GetGroupRequest
 * @param {string} groupId - The ID of the group
 * @param {string} requestId - The ID of the request
 * @version 1.2
 **/

export const GROUP_REQUEST_QUERY_KEY = (groupId: string, requestId: string) => [
  ...GROUP_REQUESTS_QUERY_KEY(groupId),
  requestId,
];

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