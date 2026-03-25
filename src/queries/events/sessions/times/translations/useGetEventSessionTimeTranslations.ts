import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionTimeTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_TIME_QUERY_KEY } from "../useGetEventSessionTime";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  timeId: string
) => [...EVENT_SESSION_TIME_QUERY_KEY(eventId, sessionId, timeId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_TIME_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionTimeTranslations>>
) => {
  client.setQueryData(
    EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionTimeTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  timeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionTimeTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sessionId,
  timeId,
  adminApiParams,
}: GetEventSessionTimeTranslationsProps): Promise<
  ConnectedXMResponse<EventSessionTimeTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/times/${timeId}/translations`,
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
export const useGetEventSessionTimeTranslations = (
  eventId: string = "",
  sessionId: string = "",
  timeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionTimeTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionTimeTranslations>>
  >(
    EVENT_SESSION_TIME_TRANSLATIONS_QUERY_KEY(eventId, sessionId, timeId),
    (params: InfiniteQueryParams) =>
      GetEventSessionTimeTranslations({
        ...params,
        eventId,
        sessionId,
        timeId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!timeId && (options.enabled ?? true),
    }
  );
};
