import { ConnectedXMResponse } from "@src/interfaces";
import { Ticket } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SECTION_QUERY_KEY } from "./useGetEventSection";

export const EVENT_SECTION_TICKETS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_SECTION_QUERY_KEY(eventId, sectionId), "TICKETS"];

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

export const GetEventSectionTickets = async ({
  eventId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSectionTicketsProps): Promise<ConnectedXMResponse<Ticket[]>> => {
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

const useGetEventSectionTickets = (eventId: string, sectionId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSectionTickets>>
  >(
    EVENT_SECTION_TICKETS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) => GetEventSectionTickets(params),
    {
      eventId,
      sectionId,
    },
    {
      enabled: !!eventId && !!sectionId,
    }
  );
};

export default useGetEventSectionTickets;
