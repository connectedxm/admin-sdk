import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Group } from "@src/interfaces";
import { GROUPS_QUERY_KEY } from "./useGetGroups";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches details for a specific group by its ID.
 * This function utilizes a connected single query to retrieve data about a group within the system.
 * It is designed to be used in applications where detailed information about a group is required.
 * @name GetGroup
 * @param {string} groupId (path) The ID of the group
 * @version 1.3
 **/

export const GROUP_QUERY_KEY = (groupId: string) => [
  ...GROUPS_QUERY_KEY(),
  groupId,
];

export const SET_GROUP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroup>>
) => {
  client.setQueryData(GROUP_QUERY_KEY(...keyParams), response);
};

interface GetGroupProps extends SingleQueryParams {
  groupId: string;
}

export const GetGroup = async ({
  groupId,
  adminApiParams,
}: GetGroupProps): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}`);
  return data;
};

export const useGetGroup = (
  groupId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetGroup>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroup>>(
    GROUP_QUERY_KEY(groupId),
    (params: SingleQueryParams) => GetGroup({ groupId, ...params }),
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    },
    "groups"
  );
};
