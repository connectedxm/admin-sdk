import { ConnectedXMResponse } from "@src/interfaces";
import { Package } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PACKAGES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "PACKAGES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PACKAGES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PACKAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPackages>>
) => {
  client.setQueryData(EVENT_PACKAGES_QUERY_KEY(...keyParams), response);
};

interface GetEventPackagesProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPackages = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPackagesProps): Promise<ConnectedXMResponse<Package[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/packages`, {
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
 * @group Events
 */
export const useGetEventPackages = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPackages>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPackages>>
  >(
    EVENT_PACKAGES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventPackages({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
