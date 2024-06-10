import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Benefit } from "@src/interfaces";
import { BENEFITS_QUERY_KEY } from "./useGetBenefits";
import { QueryClient } from "@tanstack/react-query";

export const BENEFIT_QUERY_KEY = (benefitId: string) => [
  ...BENEFITS_QUERY_KEY(),
  benefitId,
];

export const SET_BENEFIT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BENEFIT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefit>>
) => {
  client.setQueryData(BENEFIT_QUERY_KEY(...keyParams), response);
};

interface GetBenefitProps {
  benefitId: string;
}

export const GetBenefit = async ({
  benefitId,
}: GetBenefitProps): Promise<ConnectedXMResponse<Benefit>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/benefits/${benefitId}`);
  return data;
};

const useGetBenefit = (benefitId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBenefit>>(
    BENEFIT_QUERY_KEY(benefitId),
    () => GetBenefit({ benefitId }),
    {
      enabled: !!benefitId,
    }
  );
};

export default useGetBenefit;
