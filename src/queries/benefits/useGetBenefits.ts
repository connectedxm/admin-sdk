import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Benefit } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Benefits
 */
export const BENEFITS_QUERY_KEY = (eventId?: string) => {
  const keys = ["BENEFITS"];
  if (eventId) keys.push(eventId);
  return keys;
};

/**
 * @category Setters
 * @group Benefits
 */
export const SET_BENEFITS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BENEFITS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefits>>
) => {
  client.setQueryData(BENEFITS_QUERY_KEY(...keyParams), response);
};

interface GetBenefitsProps extends InfiniteQueryParams {
  eventId?: string;
}

/**
 * @category Queries
 * @group Benefits
 */
export const GetBenefits = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  adminApiParams,
}: GetBenefitsProps): Promise<ConnectedXMResponse<Benefit[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/benefits`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      eventId: eventId || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Benefits
 */
export const useGetBenefits = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetBenefits>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetBenefits>>>(
    BENEFITS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetBenefits({ ...params, eventId }),
    params,
    options
  );
};
