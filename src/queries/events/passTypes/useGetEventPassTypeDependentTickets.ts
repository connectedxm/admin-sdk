import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_PASS_TYPE_QUERY_KEY } from "./useGetEventPassType";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_TYPE_DEPENDENT_TICKETS_QUERY_KEY = (
  eventId: string,
  passTypeId: string
) => [...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId), "DEPENDENT_TICKETS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_TYPE_DEPENDENT_TICKETS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_DEPENDENT_TICKETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypeDependentTickets>>
) => {
  client.setQueryData(
    EVENT_PASS_TYPE_DEPENDENT_TICKETS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassTypeDependentTicketsProps extends InfiniteQueryParams {
  eventId: string;
  passTypeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassTypeDependentTickets = async ({
  eventId,
  passTypeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassTypeDependentTicketsProps): Promise<
  ConnectedXMResponse<EventPassType[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/dependentTickets`,
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
export const useGetEventPassTypeDependentTickets = (
  eventId: string = "",
  passTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassTypeDependentTickets>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassTypeDependentTickets>>
  >(
    EVENT_PASS_TYPE_DEPENDENT_TICKETS_QUERY_KEY(eventId, passTypeId),
    (params: InfiniteQueryParams) =>
      GetEventPassTypeDependentTickets({
        ...params,
        eventId,
        passTypeId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passTypeId && (options?.enabled ?? true),
    }
  );
};
