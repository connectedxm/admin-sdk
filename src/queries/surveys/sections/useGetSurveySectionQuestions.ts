import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveySectionQuestion } from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SURVEY_SECTION_QUERY_KEY } from "./useGetSurveySection";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_SECTION_QUESTIONS_QUERY_KEY = (
  surveyId: string,
  sectionId: string
) => [...SURVEY_SECTION_QUERY_KEY(surveyId, sectionId), "QUESTIONS"];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_SECTION_QUESTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_SECTION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySectionQuestions>>
) => {
  client.setQueryData(
    [
      ...SURVEY_SECTION_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    {
      pages: [response],
      pageParams: [null],
    },
    "surveys"
  );
};

interface GetSurveySectionQuestionsProps extends InfiniteQueryParams {
  surveyId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySectionQuestions = async ({
  surveyId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveySectionQuestionsProps): Promise<
  ConnectedXMResponse<SurveySectionQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/sections/${sectionId}/questions`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveySectionQuestions = (
  surveyId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveySectionQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveySectionQuestions>>
  >(
    SURVEY_SECTION_QUESTIONS_QUERY_KEY(surveyId, sectionId),
    (params: InfiniteQueryParams) =>
      GetSurveySectionQuestions({
        ...params,
        surveyId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && !!sectionId && (options.enabled ?? true),
    },
    "surveys"
  );
};
