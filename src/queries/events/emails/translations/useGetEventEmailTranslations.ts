import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventEmailType } from "@src/interfaces";
import { EventEmailTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_EMAIL_QUERY_KEY } from "../useGetEventEmail";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_EMAIL_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  type: EventEmailType
) => [...EVENT_EMAIL_QUERY_KEY(eventId, type), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_EMAIL_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_EMAIL_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventEmailTranslations>>
) => {
  client.setQueryData(
    EVENT_EMAIL_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventEmailTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  type: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventEmailTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  type,
  adminApiParams,
}: GetEventEmailTranslationsProps): Promise<
  ConnectedXMResponse<EventEmailTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/emails/${type}/translations`,
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
export const useGetEventEmailTranslations = (
  eventId: string = "",
  type: EventEmailType,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventEmailTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventEmailTranslations>>
  >(
    EVENT_EMAIL_TRANSLATIONS_QUERY_KEY(eventId, type),
    (params: InfiniteQueryParams) =>
      GetEventEmailTranslations({
        ...params,
        eventId,
        type,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!type && (options.enabled ?? true),
    },
    "events"
  );
};
