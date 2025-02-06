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
 * Endpoint to fetch details of a specific benefit by its ID.
 * This function allows users to retrieve comprehensive information about a particular benefit.
 * It is designed for applications that require detailed data on benefits for display or processing.
 * @name GetBenefit
 * @param {string} benefitId (path) - The ID of the benefit
 * @version 1.3
 **/

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

interface GetBenefitProps extends SingleQueryParams {
  benefitId: string;
}

export const GetBenefit = async ({
  benefitId,
  adminApiParams,
}: GetBenefitProps): Promise<ConnectedXMResponse<Benefit>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/benefits/${benefitId}`);
  return data;
};

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