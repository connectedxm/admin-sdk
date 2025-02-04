import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ChannelContent } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { INTEREST_QUERY_KEY } from "./useGetInterest";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to fetch the contents associated with a specific interest.
 * This function retrieves a list of content items related to a given interest ID, 
 * allowing users to explore and interact with content categorized under specific interests.
 * It is designed to be used in applications where content needs to be dynamically loaded 
 * based on user interests.
 * @name GetInterestContents
 * @param {string} interestId - The id of the interest
 * @version 1.2
 **/

export const INTEREST_CONTENTS_QUERY_KEY = (interestId: string) => [
  ...INTEREST_QUERY_KEY(interestId),
  "CONTENTS",
];

export const SET_INTEREST_CONTENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEREST_CONTENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterestContents>>
) => {
  client.setQueryData(INTEREST_CONTENTS_QUERY_KEY(...keyParams), response);
};

interface GetInterestContentsProps extends InfiniteQueryParams {
  interestId: string;
}

export const GetInterestContents = async ({
  interestId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetInterestContentsProps): Promise<
  ConnectedXMResponse<ChannelContent[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests/${interestId}/contents`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetInterestContents = (
  interestId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetInterestContents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInterestContents>>
  >(
    INTEREST_CONTENTS_QUERY_KEY(interestId),
    (params: InfiniteQueryParams) =>
      GetInterestContents({
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