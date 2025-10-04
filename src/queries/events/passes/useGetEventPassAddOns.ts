import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryOptions,
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_PASS_QUERY_KEY } from "./useGetEventPass";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_ADD_ONS_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "ADD_ONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_ADD_ONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassAddOns>>
) => {
  client.setQueryData(EVENT_PASS_ADD_ONS_QUERY_KEY(...keyParams), response);
};

interface GetEventPassAddOnsProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassAddOns = async ({
  eventId,
  passId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassAddOnsProps): Promise<ConnectedXMResponse<EventAddOn[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/addOns`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPassAddOns = (
  eventId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassAddOns>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassAddOns>>
  >(
    EVENT_PASS_ADD_ONS_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassAddOns({
        ...params,
        eventId,
        passId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId && (options.enabled ?? true),
    }
  );
};
