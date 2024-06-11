import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventReservationSectionLocation } from "@src/interfaces";
import { EVENT_RESERVATION_SECTION_QUERY_KEY } from "../useGetEventReservationSection";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

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
  response: Awaited<ReturnType<typeof GetEventReservationSectionLocations>>
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

export const GetEventReservationSectionLocations = async ({
  eventId,
  reservationSectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
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
export const useGetEventReservationSectionLocations = (
  eventId: string = "",
  reservationSectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventReservationSectionLocations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventReservationSectionLocations>>
  >(
    EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(
      eventId,
      reservationSectionId
    ),
    (params: InfiniteQueryParams) =>
      GetEventReservationSectionLocations({
        ...params,
        eventId,
        reservationSectionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!reservationSectionId && (options.enabled ?? true),
    }
  );
};
