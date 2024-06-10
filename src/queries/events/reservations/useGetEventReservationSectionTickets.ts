import { ConnectedXMResponse } from "@src/interfaces";
import { Ticket } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_RESERVATION_SECTION_QUERY_KEY } from "./useGetEventReservationSection";

export const EVENT_RESERVATION_SECTION_TICKETS_QUERY_KEY = (
  eventId: string,
  reservationSectionId: string
) => [
  ...EVENT_RESERVATION_SECTION_QUERY_KEY(eventId, reservationSectionId),
  "TICKETS",
];

export const SET_EVENT_RESERVATION_SECTION_TICKETS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_RESERVATION_SECTION_TICKETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventReservationSectionTickets>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_TICKETS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionTicketsProps extends InfiniteQueryParams {
  eventId: string;
  reservationSectionId: string;
}

export const GetEventReservationSectionTickets = async ({
  eventId,
  reservationSectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventReservationSectionTicketsProps): Promise<
  ConnectedXMResponse<Ticket[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/tickets`,
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

const useGetEventReservationSectionTickets = (
  eventId: string,
  reservationSectionId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventReservationSectionTickets>>
  >(
    EVENT_RESERVATION_SECTION_TICKETS_QUERY_KEY(eventId, reservationSectionId),
    (params: any) => GetEventReservationSectionTickets(params),
    {
      eventId,
      reservationSectionId,
    },
    {
      enabled: !!eventId && !!reservationSectionId,
    }
  );
};

export default useGetEventReservationSectionTickets;
