import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Channel } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { INTEREST_QUERY_KEY } from "./useGetInterest";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @channel Interests
 */
export const INTEREST_CHANNELS_QUERY_KEY = (interestId: string) => [
  ...INTEREST_QUERY_KEY(interestId),
  "CHANNELS",
];

/**
 * @category Setters
 * @channel Interests
 */
export const SET_INTEREST_CHANNELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEREST_CHANNELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterestChannels>>
) => {
  client.setQueryData(INTEREST_CHANNELS_QUERY_KEY(...keyParams), response);
};

interface GetInterestChannelsProps extends InfiniteQueryParams {
  interestId: string;
}

/**
 * @category Queries
 * @channel Interests
 */
export const GetInterestChannels = async ({
  interestId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetInterestChannelsProps): Promise<ConnectedXMResponse<Channel[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests/${interestId}/channels`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @channel Interests
 */
export const useGetInterestChannels = (
  interestId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetInterestChannels>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInterestChannels>>
  >(
    INTEREST_CHANNELS_QUERY_KEY(interestId),
    (params: InfiniteQueryParams) =>
      GetInterestChannels({
        ...params,
        interestId,
      }),
    params,
    {
      ...options,
      enabled: !!interestId && (options.enabled ?? true),
    },
    "interests"
  );
};
