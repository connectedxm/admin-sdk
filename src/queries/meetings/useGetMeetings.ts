import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, BaseMeeting } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETINGS_QUERY_KEY = () => {
  return ["MEETINGS"];
};

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETINGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETINGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetings>>
) => {
  client.setQueryData(MEETINGS_QUERY_KEY(...keyParams), response);
};

interface GetMeetingsParams extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetings = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetMeetingsParams): Promise<ConnectedXMResponse<BaseMeeting[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/meetings`, {
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
 * @group StreamsV2
 */
export const useGetMeetings = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetMeetings>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetMeetings>>>(
    MEETINGS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetMeetings(params),
    params,
    options
  );
};
