import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventReservationSection } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_RESERVATION_SECTIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "RESERVATION_SECTIONS",
];

export const SET_EVENT_RESERVATION_SECTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_RESERVATION_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventReservationSections>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventReservationSections = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventReservationSectionsProps): Promise<
  ConnectedXMResponse<EventReservationSection[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections`,
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
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventReservationSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventReservationSections>>
  >(
    EVENT_RESERVATION_SECTIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventReservationSections({
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

export default useGetEventReservationSections;
