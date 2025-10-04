import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveySectionTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { SURVEY_SECTION_QUERY_KEY } from "../useGetSurveySection";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_SECTION_TRANSLATIONS_QUERY_KEY = (
  surveyId: string,
  sectionId: string
) => [...SURVEY_SECTION_QUERY_KEY(surveyId, sectionId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_SECTION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_SECTION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySectionTranslations>>
) => {
  client.setQueryData(
    SURVEY_SECTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveySectionTranslationsProps extends InfiniteQueryParams {
  surveyId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySectionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  surveyId,
  sectionId,
  adminApiParams,
}: GetSurveySectionTranslationsProps): Promise<
  ConnectedXMResponse<SurveySectionTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/sections/${sectionId}/translations`,
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
export const useGetSurveySectionTranslations = (
  surveyId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveySectionTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveySectionTranslations>>
  >(
    SURVEY_SECTION_TRANSLATIONS_QUERY_KEY(surveyId, sectionId),
    (params: InfiniteQueryParams) =>
      GetSurveySectionTranslations({
        ...params,
        surveyId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && !!sectionId && (options.enabled ?? true),
    }
  );
};
