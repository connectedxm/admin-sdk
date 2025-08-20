import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationFollowupTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_FOLLOWUP_QUERY_KEY } from "../useGetEventFollowup";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FOLLOWUP_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  followupId: string
) => [...EVENT_FOLLOWUP_QUERY_KEY(eventId, followupId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FOLLOWUP_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_FOLLOWUP_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFollowupTranslations>>
) => {
  client.setQueryData(
    EVENT_FOLLOWUP_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFollowupTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  followupId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFollowupTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  followupId,
  adminApiParams,
}: GetEventFollowupTranslationsProps): Promise<
  ConnectedXMResponse<RegistrationFollowupTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/followups/${followupId}/translations`,
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
export const useGetEventFollowupTranslations = (
  eventId: string = "",
  followupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFollowupTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFollowupTranslations>>
  >(
    EVENT_FOLLOWUP_TRANSLATIONS_QUERY_KEY(eventId, followupId),
    (params: InfiniteQueryParams) =>
      GetEventFollowupTranslations({
        ...params,
        eventId,
        followupId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!followupId && (options.enabled ?? true),
    },
    "events"
  );
};
