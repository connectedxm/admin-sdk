import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ActivationTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_ACTIVATION_QUERY_KEY } from "../useGetEventActivation";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  activationId: string
) => [...EVENT_ACTIVATION_QUERY_KEY(eventId, activationId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ACTIVATION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivationTranslations>>
) => {
  client.setQueryData(
    EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventActivationTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  activationId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventActivationTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  activationId,
  adminApiParams,
}: GetEventActivationTranslationsProps): Promise<
  ConnectedXMResponse<ActivationTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/activations/${activationId}/translations`,
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
export const useGetEventActivationTranslations = (
  eventId: string = "",
  activationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventActivationTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivationTranslations>>
  >(
    EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY(eventId, activationId),
    (params: InfiniteQueryParams) =>
      GetEventActivationTranslations({
        ...params,
        eventId,
        activationId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!activationId && (options.enabled ?? true),
    }
  );
};
