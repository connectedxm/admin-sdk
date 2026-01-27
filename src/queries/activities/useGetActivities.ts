import {
  ActivityStatus,
  ConnectedXMResponse,
  ModerationStatus,
} from "@src/interfaces";
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
  featured?: true,
  status?: keyof typeof ActivityStatus,
  global?: boolean
) => {
  const key = ["ACTIVITIES"];
  if (moderation) {
    key.push(moderation);
  }
  if (featured) {
    key.push("FEATURED");
  }
  if (status) {
    key.push(status);
  }
  if (global) {
    key.push("GLOBAL");
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
  status?: keyof typeof ActivityStatus;
  global?: boolean;
}

/**
 * @category Queries
 * @group Activities
 */
export const GetActivities = async ({
  moderation,
  featured,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
  global,
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
      status: status || undefined,
      global: global || undefined,
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
  status?: keyof typeof ActivityStatus,
  global: boolean = false,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetActivities>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetActivities>>>(
    ACTIVITIES_QUERY_KEY(moderation, featured, status, global),
    (params: InfiniteQueryParams) =>
      GetActivities({ ...params, moderation, featured, status, global }),
    params,
    options
  );
};
