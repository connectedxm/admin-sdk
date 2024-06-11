import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventActivationTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_ACTIVATION_QUERY_KEY } from "../useGetEventActivation";

export const EVENT_ACTIVATION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  activationId: string
) => [...EVENT_ACTIVATION_QUERY_KEY(eventId, activationId), "TRANSLATIONS"];

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

export const GetEventActivationTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  activationId,
  adminApiParams,
}: GetEventActivationTranslationsProps): Promise<
  ConnectedXMResponse<EventActivationTranslation[]>
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
