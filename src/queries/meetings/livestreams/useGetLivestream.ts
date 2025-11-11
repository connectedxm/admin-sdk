import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Livestream } from "@src/interfaces";
import { LIVESTREAMS_QUERY_KEY } from "./useGetLivestreams";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const LIVESTREAM_QUERY_KEY = (livestreamId?: string) => [
  ...LIVESTREAMS_QUERY_KEY(),
  livestreamId ?? "",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_LIVESTREAM_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LIVESTREAM_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLivestream>>
) => {
  client.setQueryData(LIVESTREAM_QUERY_KEY(...keyParams), response);
};

interface GetLivestreamParams extends SingleQueryParams {
  livestreamId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetLivestream = async ({
  livestreamId,
  adminApiParams,
}: GetLivestreamParams): Promise<ConnectedXMResponse<Livestream>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/meetings/livestreams/${livestreamId}`);

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetLivestream = (
  livestreamId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLivestream>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLivestream>>(
    LIVESTREAM_QUERY_KEY(livestreamId),
    (params) => GetLivestream({ livestreamId, ...params }),
    {
      ...options,
      enabled: !!livestreamId && (options?.enabled ?? true),
    }
  );
};
