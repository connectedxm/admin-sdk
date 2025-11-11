import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { ConnectedXMResponse, Preset } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const PRESETS_QUERY_KEY = () => {
  return ["STREAMS_V2", "PRESETS"];
};

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_PRESETS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PRESETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPresets>>
) => {
  client.setQueryData(PRESETS_QUERY_KEY(...keyParams), response);
};

interface GetPresetsParams extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetPresets = async ({
  pageParam,
  pageSize,
  orderBy,
  adminApiParams,
}: GetPresetsParams): Promise<ConnectedXMResponse<Preset[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/meetings/presets`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
    },
  });

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetPresets = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetPresets>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetPresets>>>(
    PRESETS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetPresets(params),
    params,
    options
  );
};
