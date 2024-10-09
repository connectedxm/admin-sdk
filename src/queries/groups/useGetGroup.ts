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
 * @category Keys
 * @group Groups
 */
export const GROUP_QUERY_KEY = (groupId: string) => [
  ...GROUPS_QUERY_KEY(),
  groupId,
];

/**
 * @category Setters
 * @group Groups
 */
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

/**
 * @category Queries
 * @group Groups
 */
export const GetGroup = async ({
  groupId,
  adminApiParams,
}: GetGroupProps): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}`);
  return data;
};
/**
 * @category Hooks
 * @group Groups
 */
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
