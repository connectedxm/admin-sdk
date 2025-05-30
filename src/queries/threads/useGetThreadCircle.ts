import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ThreadCircle } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { QueryClient } from "@tanstack/react-query";
import { THREAD_CIRCLES_QUERY_KEY } from "./useGetThreadCircles";

/**
 * @category Keys
 * @group Threads
 */
export const THREAD_CIRCLE_QUERY_KEY = (circleId: string) => [
  ...THREAD_CIRCLES_QUERY_KEY(),
  circleId,
];

/**
 * @category Setters
 * @group Threads
 */
export const SET_THREAD_CIRCLE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_CIRCLE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadCircle>>
) => {
  client.setQueryData(THREAD_CIRCLE_QUERY_KEY(...keyParams), response);
};

interface GetThreadCircleProps extends SingleQueryParams {
  circleId: string;
}

/**
 * @category Queries
 * @group Threads
 */
export const GetThreadCircle = async ({
  circleId,
  adminApiParams,
}: GetThreadCircleProps): Promise<ConnectedXMResponse<ThreadCircle>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/circles/${circleId}`);
  return data;
};

/**
 * @category Hooks
 * @group Threads
 */
export const useGetThreadCircle = (
  circleId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetThreadCircle>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadCircle>>(
    THREAD_CIRCLE_QUERY_KEY(circleId),
    (params: SingleQueryParams) => GetThreadCircle({ circleId, ...params }),
    {
      ...options,
      enabled: !!circleId && (options.enabled ?? true),
    },
    "threads"
  );
};
