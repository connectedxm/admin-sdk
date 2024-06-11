import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventReservationSectionLocation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_RESERVATION_SECTION_QUERY_KEY } from "../useGetEventReservationSection";

export const EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY = (
  eventId: string,
  reservationSectionId: string
) => [
  ...EVENT_RESERVATION_SECTION_QUERY_KEY(eventId, reservationSectionId),
  "RESERVATION_SECTION_LOCATIONS",
];

export const SET_EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventReservationSections>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionsProps extends InfiniteQueryParams {
  eventId: string;
  reservationSectionId: string;
}

export const GetEventReservationSections = async ({
  eventId,
  reservationSectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventReservationSectionsProps): Promise<
  ConnectedXMResponse<EventReservationSectionLocation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations`,
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

const useGetEventReservationSections = (
  eventId: string,
  reservationSectionId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventReservationSections>>
  >(
    EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(
      eventId,
      reservationSectionId
    ),
    (params: InfiniteQueryParams) => GetEventReservationSections(params),
    {
      eventId,
      reservationSectionId,
    },
    {
      enabled: !!eventId && !!reservationSectionId,
    }
  );
};

export default useGetEventReservationSections;
