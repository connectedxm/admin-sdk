import { ConnectedXMResponse } from "@src/interfaces";
import { EventAttribute } from "@src/interfaces";
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
export const EVENT_ATTRIBUTES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ATTRIBUTES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTRIBUTES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ATTRIBUTES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttributes>>
) => {
  client.setQueryData(EVENT_ATTRIBUTES_QUERY_KEY(...keyParams), response);
};

interface GetEventAttributesProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttributes = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAttributesProps): Promise<
  ConnectedXMResponse<EventAttribute[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/attributes`, {
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
export const useGetEventAttributes = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttributes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttributes>>
  >(
    EVENT_ATTRIBUTES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventAttributes({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};
