import { ConnectedXMResponse, ModerationStatus } from "@src/interfaces";
import { Activity } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Activities
 */
export const ACTIVITIES_QUERY_KEY = (
  moderation?: keyof typeof ModerationStatus,
  featured?: true
) => {
  const key = ["ACTIVITIES"];
  if (moderation) {
    key.push(moderation);
  }
  if (featured) {
    key.push("FEATURED");
  }
  return key;
};

/**
 * @category Setters
 * @group Activities
 */
export const SET_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivities>>
) => {
  client.setQueryData(ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetActivitiesProps extends InfiniteQueryParams {
  moderation?: keyof typeof ModerationStatus;
  featured?: true;
}

/**
 * @category Queries
 * @group Activities
 */
export const GetActivities = async ({
  moderation,
  featured,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      moderation: moderation || undefined,
      featured: featured || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Activities
 */
export const useGetActivities = (
  moderation?: keyof typeof ModerationStatus,
  featured?: true,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetActivities>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetActivities>>>(
    ACTIVITIES_QUERY_KEY(moderation, featured),
    (params: InfiniteQueryParams) =>
      GetActivities({ ...params, moderation, featured }),
    params,
    options,
    "activities"
  );
};
