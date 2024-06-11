import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_RESERVATION_SECTION_QUERY_KEY } from "../useGetEventReservationSection";
import { EventReservationSectionTranslation } from "@src/interfaces";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  reservationSectionId: string
) => [
  ...EVENT_RESERVATION_SECTION_QUERY_KEY(eventId, reservationSectionId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventReservationSectionTranslations>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionTranslationsProps
  extends InfiniteQueryParams {
  eventId: string;
  reservationSectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventReservationSectionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  reservationSectionId,
  adminApiParams,
}: GetEventReservationSectionTranslationsProps): Promise<
  ConnectedXMResponse<EventReservationSectionTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/translations`,
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
export const useGetEventReservationSectionTranslations = (
  eventId: string = "",
  reservationSectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventReservationSectionTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventReservationSectionTranslations>>
  >(
    EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY(
      eventId,
      reservationSectionId
    ),
    (params: InfiniteQueryParams) =>
      GetEventReservationSectionTranslations({
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
