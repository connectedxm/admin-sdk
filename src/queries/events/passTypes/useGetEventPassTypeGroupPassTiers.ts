import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PASS_TYPE_QUERY_KEY } from "./useGetEventPassType";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_TYPE_GROUP_PASS_TIERS_QUERY_KEY = (
  eventId: string,
  passTypeId: string
) => [...EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId), "GROUP_PASS_TIERS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_TYPE_GROUP_PASS_TIERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_GROUP_PASS_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypeGroupPassTiers>>
) => {
  client.setQueryData(
    EVENT_PASS_TYPE_GROUP_PASS_TIERS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassTypeGroupPassTiersProps extends InfiniteQueryParams {
  eventId: string;
  passTypeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassTypeGroupPassTiers = async ({
  eventId,
  passTypeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassTypeGroupPassTiersProps): Promise<
  ConnectedXMResponse<Tier[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/groupPassTiers`,
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
export const useGetEventPassTypeGroupPassTiers = (
  eventId: string = "",
  passTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassTypeGroupPassTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassTypeGroupPassTiers>>
  >(
    EVENT_PASS_TYPE_GROUP_PASS_TIERS_QUERY_KEY(eventId, passTypeId),
    (params: InfiniteQueryParams) =>
      GetEventPassTypeGroupPassTiers({
        ...params,
        eventId,
        passTypeId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passTypeId && (options.enabled ?? true),
    }
  );
};
