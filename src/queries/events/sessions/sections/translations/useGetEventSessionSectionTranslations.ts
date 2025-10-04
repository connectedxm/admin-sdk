import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionSectionTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_SECTION_QUERY_KEY } from "../useGetEventSessionSection";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  sectionId: string
) => [
  ...EVENT_SESSION_SECTION_QUERY_KEY(eventId, sessionId, sectionId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionSectionTranslations>>
) => {
  client.setQueryData(
    EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionSectionTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionSectionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sessionId,
  sectionId,
  adminApiParams,
}: GetEventSessionSectionTranslationsProps): Promise<
  ConnectedXMResponse<EventSessionSectionTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}/translations`,
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
export const useGetEventSessionSectionTranslations = (
  eventId: string = "",
  sessionId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionSectionTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionSectionTranslations>>
  >(
    EVENT_SESSION_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sessionId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionSectionTranslations({
        ...params,
        eventId,
        sessionId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!sectionId && (options.enabled ?? true),
    }
  );
};
