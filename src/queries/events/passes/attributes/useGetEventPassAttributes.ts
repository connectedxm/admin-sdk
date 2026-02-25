import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { PassAttribute } from "@src/interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryOptions,
  InfiniteQueryParams,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_PASS_QUERY_KEY } from "../useGetEventPass";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_ATTRIBUTES_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "ATTRIBUTES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_ATTRIBUTES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_ATTRIBUTES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassAttributes>>
) => {
  client.setQueryData(EVENT_PASS_ATTRIBUTES_QUERY_KEY(...keyParams), response);
};

interface GetEventPassAttributesProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassAttributes = async ({
  eventId,
  passId,
  pageParam,
  pageSize,
  orderBy,
  adminApiParams,
}: GetEventPassAttributesProps): Promise<
  ConnectedXMResponse<PassAttribute[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/attributes`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPassAttributes = (
  eventId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassAttributes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassAttributes>>
  >(
    EVENT_PASS_ATTRIBUTES_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassAttributes({
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
