import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { BenefitClick } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { BENEFIT_QUERY_KEY } from "./useGetBenefit";
import { QueryClient } from "@tanstack/react-query";

/**
 * Retrieves click data for a specific benefit.
 * This function fetches detailed click information associated with a given benefit ID.
 * It is designed to be used in applications where tracking user interactions with benefits is required.
 * @name GetBenefitClicks
 * @param {string} benefitId (path) - The id of the benefit
 * @version 1.3
 **/

export const BENEFIT_CLICKS_QUERY_KEY = (benefitId: string) => [
  ...BENEFIT_QUERY_KEY(benefitId),
  "CLICKS",
];

export const SET_BENEFIT_CLICKS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BENEFIT_CLICKS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefitClicks>>
) => {
  client.setQueryData(BENEFIT_CLICKS_QUERY_KEY(...keyParams), response);
};

interface GetBenefitClicksProps extends InfiniteQueryParams {
  benefitId: string;
}

export const GetBenefitClicks = async ({
  benefitId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBenefitClicksProps): Promise<ConnectedXMResponse<BenefitClick[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/benefits/${benefitId}/clicks`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetBenefitClicks = (
  benefitId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBenefitClicks>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBenefitClicks>>
  >(
    BENEFIT_CLICKS_QUERY_KEY(benefitId),
    (params: InfiniteQueryParams) => GetBenefitClicks({ benefitId, ...params }),
    params,
    {
      ...options,
      enabled: !!benefitId && (options.enabled ?? true),
    },
    "benefits"
  );
};