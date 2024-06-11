import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventReservationSectionTranslation } from "@src/interfaces";
import { EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventReservationSectionTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

export const EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  reservationSectionId: string,
  locale: string
) => [
  ...EVENT_RESERVATION_SECTION_TRANSLATIONS_QUERY_KEY(
    eventId,
    reservationSectionId
  ),
  locale,
];

export const SET_EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventReservationSectionTranslation>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionTranslationProps extends SingleQueryParams {
  eventId: string;
  reservationSectionId: string;
  locale: string;
}

export const GetEventReservationSectionTranslation = async ({
  eventId,
  reservationSectionId,
  locale,
  adminApiParams,
}: GetEventReservationSectionTranslationProps): Promise<
  ConnectedXMResponse<EventReservationSectionTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/translations/${locale}`
  );
  return data;
};
export const useGetEventReservationSectionTranslation = (
  eventId: string = "",
  reservationSectionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventReservationSectionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventReservationSectionTranslation>
  >(
    EVENT_RESERVATION_SECTION_TRANSLATION_QUERY_KEY(
      eventId,
      reservationSectionId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetEventReservationSectionTranslation({
        eventId,
        reservationSectionId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!reservationSectionId &&
        !!locale &&
        (options?.enabled ?? true),
    }
  );
};
