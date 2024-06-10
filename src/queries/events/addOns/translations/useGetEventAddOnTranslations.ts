import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOnTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_ADD_ON_QUERY_KEY } from "../useGetEventAddOn";

export const EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  addOnId: string
) => [...EVENT_ADD_ON_QUERY_KEY(eventId, addOnId), "TRANSLATIONS"];

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

export const GetEventAddOnTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  addOnId,
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

const useGetEventAddOnTranslations = (eventId: string, addOnId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAddOnTranslations>>
  >(
    EVENT_ADD_ON_TRANSLATIONS_QUERY_KEY(eventId, addOnId),
    (params: any) => GetEventAddOnTranslations(params),
    {
      eventId,
      addOnId,
    },
    {
      enabled: !!eventId && !!addOnId,
    }
  );
};

export default useGetEventAddOnTranslations;
