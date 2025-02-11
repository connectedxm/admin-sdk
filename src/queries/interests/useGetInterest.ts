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
 * Endpoint to retrieve detailed information about a specific interest by its unique identifier.
 * This function is designed to be used in applications where detailed information about an interest is required.
 * It utilizes a connected single query to fetch the interest data.
 * @name GetInterest
 * @param {string} interestId (path) The id of the interest
 * @version 1.3
 **/

export const INTEREST_QUERY_KEY = (interestId: string) => [
  ...INTERESTS_QUERY_KEY(),
  interestId,
];

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

export const GetInterest = async ({
  interestId,
  adminApiParams,
}: GetInterestProps): Promise<ConnectedXMResponse<Interest>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests/${interestId}`);
  return data;
};

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
    },
    "interests"
  );
};
