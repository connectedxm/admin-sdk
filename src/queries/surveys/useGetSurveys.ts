import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Survey } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEYS_QUERY_KEY = () => ["SURVEYS"];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEYS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEYS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveys>>
) => {
  client.setQueryData(SURVEYS_QUERY_KEY(...keyParams), response);
};

interface GetSurveysProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveys = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveysProps): Promise<ConnectedXMResponse<Survey[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/surveys`, {
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
 * @group Surveys
 */
export const useGetSurveys = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSurveys>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSurveys>>>(
    SURVEYS_QUERY_KEY(),
    (params: InfiniteQueryParams) =>
      GetSurveys({
        ...params,
      }),
    params,
    options,
    "surveys"
  );
};
