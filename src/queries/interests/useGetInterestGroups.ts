import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Group } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { INTEREST_QUERY_KEY } from "./useGetInterest";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Interests
 */
export const INTEREST_GROUPS_QUERY_KEY = (interestId: string) => [
  ...INTEREST_QUERY_KEY(interestId),
  "GROUPS",
];

/**
 * @category Setters
 * @group Interests
 */
export const SET_INTEREST_GROUPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEREST_GROUPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterestGroups>>
) => {
  client.setQueryData(INTEREST_GROUPS_QUERY_KEY(...keyParams), response);
};

interface GetInterestGroupsProps extends InfiniteQueryParams {
  interestId: string;
}

/**
 * @category Queries
 * @group Interests
 */
export const GetInterestGroups = async ({
  interestId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetInterestGroupsProps): Promise<ConnectedXMResponse<Group[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests/${interestId}/groups`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Interests
 */
export const useGetInterestGroups = (
  interestId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetInterestGroups>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInterestGroups>>
  >(
    INTEREST_GROUPS_QUERY_KEY(interestId),
    (params: InfiniteQueryParams) =>
      GetInterestGroups({
        ...params,
        interestId,
      }),
    params,
    {
      ...options,
      enabled: !!interestId && (options.enabled ?? true),
    }
  );
};
