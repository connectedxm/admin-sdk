import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOnTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_ADD_ON_QUERY_KEY } from "../useGetEventAddOn";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  addOnId: string
) => [...EVENT_ADD_ON_QUERY_KEY(eventId, addOnId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ADD_ON_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOnTranslations>>
) => {
  client.setQueryData(
    EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventAddOnTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  addOnId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAddOnTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  addOnId,
  adminApiParams,
}: GetEventAddOnTranslationsProps): Promise<
  ConnectedXMResponse<EventAddOnTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/addOns/${addOnId}/translations`,
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
export const useGetEventAddOnTranslations = (
  eventId: string = "",
  addOnId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAddOnTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAddOnTranslations>>
  >(
    EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(eventId, addOnId),
    (params: InfiniteQueryParams) =>
      GetEventAddOnTranslations({
        ...params,
        eventId,
        addOnId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!addOnId && (options.enabled ?? true),
    },
    "events"
  );
};
