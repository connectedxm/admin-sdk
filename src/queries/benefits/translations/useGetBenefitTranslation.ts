import { ConnectedXMResponse } from "@src/interfaces";
import { BenefitTranslation } from "@src/interfaces";
import { BENEFIT_TRANSLATIONS_QUERY_KEY } from "./useGetBenefitTranslations";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedSingleQuery,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";

/**
 * @category Keys
 * @group Benefits
 */
export const BENEFIT_TRANSLATION_QUERY_KEY = (
  benefitId: string,
  locale: string
) => [...BENEFIT_TRANSLATIONS_QUERY_KEY(benefitId), locale];

/**
 * @category Setters
 * @group Benefits
 */
export const SET_BENEFIT_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BENEFIT_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefitTranslation>>
) => {
  client.setQueryData(BENEFIT_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetBenefitTranslationProps extends SingleQueryParams {
  benefitId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Benefits
 */
export const GetBenefitTranslation = async ({
  benefitId,
  locale,
  adminApiParams,
}: GetBenefitTranslationProps): Promise<
  ConnectedXMResponse<BenefitTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/benefits/${benefitId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Benefits
 */
export const useGetBenefitTranslation = (
  benefitId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBenefitTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBenefitTranslation>>(
    BENEFIT_TRANSLATION_QUERY_KEY(benefitId, locale),
    (params: SingleQueryParams) =>
      GetBenefitTranslation({
        benefitId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!benefitId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    },
    "benefits"
  );
};
