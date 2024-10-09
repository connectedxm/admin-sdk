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
 * @category Keys
 * @content Interests
 */
export const INTEREST_CONTENTS_QUERY_KEY = (interestId: string) => [
  ...INTEREST_QUERY_KEY(interestId),
  "CONTENTS",
];

/**
 * @category Setters
 * @content Interests
 */
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

/**
 * @category Queries
 * @content Interests
 */
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
/**
 * @category Hooks
 * @content Interests
 */
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
