import { GetAdminAPI } from '@src/AdminAPI';
import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { BENEFIT_QUERY_KEY } from "./useGetBenefit";
import { QueryClient } from "@tanstack/react-query";

export const BENEFIT_KPI_CLICKS_QUERY_KEY = (benefitId: string) => [
  ...BENEFIT_QUERY_KEY(benefitId),
  "KPI_CLICKS",
];

export const SET_BENEFIT_KPI_CLICKS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BENEFIT_KPI_CLICKS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefitKPIClicks>>
) => {
  client.setQueryData(BENEFIT_KPI_CLICKS_QUERY_KEY(...keyParams), response);
};

interface GetBenefitKPIClicksProps {
  benefitId?: string;
}

interface DateSumCount {
  day: string;
  clicks: number;
}

export const GetBenefitKPIClicks = async ({
  benefitId,
}: GetBenefitKPIClicksProps): Promise<ConnectedXMResponse<DateSumCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/benefits/${benefitId}/kpi/clicks`);
  return data;
};

const useGetBenefitKPIClicks = (benefitId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBenefitKPIClicks>>((
    BENEFIT_KPI_CLICKS_QUERY_KEY(benefitId),
    () => GetBenefitKPIClicks({ benefitId }),
    {
      enabled: !!benefitId,
    }
  );
};

export default useGetBenefitKPIClicks;
