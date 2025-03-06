import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveySection } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SURVEY_QUERY_KEY } from "../useGetSurvey";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_SECTIONS_QUERY_KEY = (surveyId: string) => [
  ...SURVEY_QUERY_KEY(surveyId),
  "SECTIONS",
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_SECTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySections>>
) => {
  client.setQueryData(SURVEY_SECTIONS_QUERY_KEY(...keyParams), response);
};

interface GetSurveySectionsProps extends InfiniteQueryParams {
  surveyId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySections = async ({
  surveyId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveySectionsProps): Promise<ConnectedXMResponse<SurveySection[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/surveys/${surveyId}/sections`, {
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
export const useGetSurveySections = (
  surveyId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveySections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveySections>>
  >(
    SURVEY_SECTIONS_QUERY_KEY(surveyId),
    (params: InfiniteQueryParams) =>
      GetSurveySections({
        ...params,
        surveyId,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && (options.enabled ?? true),
    },
    "surveys"
  );
};
