import { GetAdminAPI } from "@src/AdminAPI";
import { BaseUser, ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * Retrieves a list of users who have access to a specific event.
 * This function is used to fetch users associated with an event, providing details about their access.
 * It is useful in scenarios where event access management and user details are required.
 * @name GetEventAccessUsers
 * @param {string} eventId (path) - The id of the event
 * @version 1.3
 **/

export const EVENT_ACCESS_USERS_QUERY_KEY = (eventId: string) => [
  EVENT_QUERY_KEY(eventId),
  "ACCESS_USERS",
];

interface GetEventAccessUsersParams extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventAccessUsers = async ({
  eventId,
  pageParam = 1,
  pageSize = 10,
  orderBy,
  search,
  adminApiParams,
}: GetEventAccessUsersParams): Promise<ConnectedXMResponse<BaseUser[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/access-users`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventAccessUsers = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "adminApiParams" | "queryClient"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAccessUsers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAccessUsers>>
  >(
    EVENT_ACCESS_USERS_QUERY_KEY(eventId),
    (queryParams: InfiniteQueryParams) =>
      GetEventAccessUsers({ ...queryParams, eventId }),
    params,
    {
      enabled: !!eventId && (options.enabled ?? true),
      ...options,
    },
    "events" // Permission domain
  );
};