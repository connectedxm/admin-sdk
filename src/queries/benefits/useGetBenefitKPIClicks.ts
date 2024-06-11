import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { BENEFIT_QUERY_KEY } from "./useGetBenefit";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Benefits
 */
export const BENEFIT_KPI_CLICKS_QUERY_KEY = (benefitId: string) => [
  ...BENEFIT_QUERY_KEY(benefitId),
  "KPI_CLICKS",
];

/**
 * @category Setters
 * @group Benefits
 */
export const SET_BENEFIT_KPI_CLICKS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BENEFIT_KPI_CLICKS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefitKPIClicks>>
) => {
  client.setQueryData(BENEFIT_KPI_CLICKS_QUERY_KEY(...keyParams), response);
};

interface GetBenefitKPIClicksProps extends SingleQueryParams {
  benefitId?: string;
}

interface DateSumCount {
  day: string;
  clicks: number;
}

/**
 * @category Queries
 * @group Benefits
 */
export const GetBenefitKPIClicks = async ({
  benefitId,
  adminApiParams,
}: GetBenefitKPIClicksProps): Promise<ConnectedXMResponse<DateSumCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/benefits/${benefitId}/kpi/clicks`);
  return data;
};
/**
 * @category Hooks
 * @group Benefits
 */
export const useGetBenefitKPIClicks = (
  benefitId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBenefitKPIClicks>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBenefitKPIClicks>>(
    BENEFIT_KPI_CLICKS_QUERY_KEY(benefitId),
    (params: SingleQueryParams) =>
      GetBenefitKPIClicks({ benefitId, ...params }),
    {
      ...options,
      enabled: !!benefitId && (options?.enabled ?? true),
    }
  );
};
