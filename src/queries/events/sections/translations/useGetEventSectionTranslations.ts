import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  EventPageTranslation,
  RegistrationSectionTranslation,
} from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_SECTION_QUERY_KEY } from "../useGetEventSection";

export const EVENT_SECTION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_SECTION_QUERY_KEY(eventId, sectionId), "TRANSLATIONS"];

export const SET_EVENT_SECTION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSectionTranslations>>
) => {
  client.setQueryData(
    EVENT_SECTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSectionTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventSectionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sectionId,
}: GetEventSectionTranslationsProps): Promise<
  ConnectedXMResponse<RegistrationSectionTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}/translations`,
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

const useGetEventSectionTranslations = (eventId: string, sectionId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSectionTranslations>>
  >(
    EVENT_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    (params: any) => GetEventSectionTranslations(params),
    {
      eventId,
      sectionId,
    },
    {
      enabled: !!eventId && !!sectionId,
    }
  );
};

export default useGetEventSectionTranslations;
