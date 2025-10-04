import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Interest } from "@src/interfaces";
import { INTERESTS_QUERY_KEY } from "../interests/useGetInterests";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Interests
 */
export const INTEREST_QUERY_KEY = (interestId: string) => [
  ...INTERESTS_QUERY_KEY(),
  interestId,
];

/**
 * @category Setters
 * @group Interests
 */
export const SET_INTEREST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEREST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterest>>
) => {
  client.setQueryData(INTEREST_QUERY_KEY(...keyParams), response);
};

interface GetInterestProps extends SingleQueryParams {
  interestId: string;
}

/**
 * @category Queries
 * @group Interests
 */
export const GetInterest = async ({
  interestId,
  adminApiParams,
}: GetInterestProps): Promise<ConnectedXMResponse<Interest>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests/${interestId}`);
  return data;
};
/**
 * @category Hooks
 * @group Interests
 */
export const useGetInterest = (
  interestId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetInterest>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetInterest>>(
    INTEREST_QUERY_KEY(interestId),
    (params: SingleQueryParams) => GetInterest({ interestId, ...params }),
    {
      ...options,
      enabled: !!interestId && (options?.enabled ?? true),
    }
  );
};
