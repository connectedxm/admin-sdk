import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { BenefitTranslation } from "@src/interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { BENEFIT_QUERY_KEY } from "../useGetBenefit";

/**
 * Retrieves translations for a specific benefit by its ID.
 * This function is used to fetch a list of translations associated with a particular benefit, 
 * allowing applications to display benefit information in multiple languages.
 * It is designed to be used in scenarios where multilingual support for benefits is required.
 * @name GetBenefitTranslations
 * @param {string} benefitId - The ID of the benefit
 * @version 1.2
**/

/**
 * @category Keys
 * @group Benefits
 */
export const BENEFIT_TRANSLATIONS_QUERY_KEY = (benefitId: string) => [
  ...BENEFIT_QUERY_KEY(benefitId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Benefits
 */
export const SET_BENEFIT_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BENEFIT_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefitTranslations>>
) => {
  client.setQueryData(BENEFIT_TRANSLATIONS_QUERY_KEY(...keyParams), response);
};

interface GetBenefitTranslationsProps extends InfiniteQueryParams {
  benefitId: string;
}

/**
 * @category Queries
 * @group Benefits
 */
export const GetBenefitTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  benefitId,
  adminApiParams,
}: GetBenefitTranslationsProps): Promise<
  ConnectedXMResponse<BenefitTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/benefits/${benefitId}/translations`, {
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
 * @group Benefits
 */
export const useGetBenefitTranslations = (
  benefitId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBenefitTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBenefitTranslations>>
  >(
    BENEFIT_TRANSLATIONS_QUERY_KEY(benefitId),
    (params: InfiniteQueryParams) =>
      GetBenefitTranslations({ benefitId, ...params }),
    params,
    {
      ...options,
      enabled: !!benefitId && (options.enabled ?? true),
    },
    "benefits"
  );
};