import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationBypass } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * Fetches a list of event registration bypass entries with support for pagination and filtering.
 * This function is designed to retrieve bypass entries for a specific event, allowing for detailed
 * management and review of registration bypasses. It supports pagination and filtering to efficiently
 * handle large datasets.
 * @name GetEventRegistrationBypassList
 * @param {string} eventId (path) The id of the event
 * @version 1.3
 **/

export const EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "BYPASS_LIST",
];

interface GetEventRegistrationBypassListProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventRegistrationBypassList = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRegistrationBypassListProps): Promise<
  ConnectedXMResponse<RegistrationBypass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/bypass`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventRegistrationBypassList = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRegistrationBypassList>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationBypassList>>
  >(
    EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventRegistrationBypassList({
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
