import { ConnectedXMResponse } from "@src/interfaces";
import { EventTicket } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SECTION_QUERY_KEY } from "./useGetEventSection";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SECTION_TICKETS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_SECTION_QUERY_KEY(eventId, sectionId), "TICKETS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SECTION_TICKETS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTION_TICKETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSectionTickets>>
) => {
  client.setQueryData(EVENT_SECTION_TICKETS_QUERY_KEY(...keyParams), response);
};

interface GetEventSectionTicketsProps extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSectionTickets = async ({
  eventId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSectionTicketsProps): Promise<
  ConnectedXMResponse<EventTicket[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}/tickets`,
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
export const useGetEventSectionTickets = (
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSectionTickets>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSectionTickets>>
  >(
    EVENT_SECTION_TICKETS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventSectionTickets({
        ...params,
        eventId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sectionId,
    }
  );
};
