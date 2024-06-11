import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SECTION_QUERY_KEY } from "./useGetEventSection";

export const EVENT_SECTION_TIERS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_SECTION_QUERY_KEY(eventId, sectionId), "TIERS"];

export const SET_EVENT_SECTION_TIERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTION_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSectionTiers>>
) => {
  client.setQueryData(EVENT_SECTION_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetEventSectionTiersProps extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventSectionTiers = async ({
  eventId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSectionTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}/tiers`,
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

const useGetEventSectionTiers = (eventId: string, sectionId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSectionTiers>>
  >(
    EVENT_SECTION_TIERS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) => GetEventSectionTiers(params),
    {
      eventId,
      sectionId,
    },
    {
      enabled: !!eventId && !!sectionId,
    }
  );
};

export default useGetEventSectionTiers;
