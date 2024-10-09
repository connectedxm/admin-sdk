import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Benefit } from "@src/interfaces";
import { BENEFITS_QUERY_KEY } from "./useGetBenefits";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Benefits
 */
export const BENEFIT_QUERY_KEY = (benefitId: string) => [
  ...BENEFITS_QUERY_KEY(),
  benefitId,
];

/**
 * @category Setters
 * @group Benefits
 */
export const SET_BENEFIT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BENEFIT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefit>>
) => {
  client.setQueryData(BENEFIT_QUERY_KEY(...keyParams), response);
};

interface GetBenefitProps extends SingleQueryParams {
  benefitId: string;
}

/**
 * @category Queries
 * @group Benefits
 */
export const GetBenefit = async ({
  benefitId,
  adminApiParams,
}: GetBenefitProps): Promise<ConnectedXMResponse<Benefit>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/benefits/${benefitId}`);
  return data;
};
/**
 * @category Hooks
 * @group Benefits
 */
export const useGetBenefit = (
  benefitId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBenefit>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBenefit>>(
    BENEFIT_QUERY_KEY(benefitId),
    (params: SingleQueryParams) => GetBenefit({ benefitId, ...params }),
    {
      ...options,
      enabled: !!benefitId && (options?.enabled ?? true),
    },
    "benefits"
  );
};
