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
 * Fetches the channels associated with a specific interest.
 * This function is used to retrieve a list of channels linked to a given interest ID.
 * It supports infinite scrolling and can be used in applications where channel data needs to be displayed dynamically.
 * @name GetInterestChannels
 * @param {string} interestId (path) The id of the interest
 * @version 1.3
 **/

export const INTEREST_CHANNELS_QUERY_KEY = (interestId: string) => [
  ...INTEREST_QUERY_KEY(interestId),
  "CHANNELS",
];

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
