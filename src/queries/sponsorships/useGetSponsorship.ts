import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Sponsorship } from "@src/interfaces";
import { SPONSORSHIPS_QUERY_KEY } from "./useGetSponsorships";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Sponsorships
 */
export const SPONSORSHIP_QUERY_KEY = (sponsorshipId: string) => [
  ...SPONSORSHIPS_QUERY_KEY(),
  sponsorshipId,
];

/**
 * @category Setters
 * @group Sponsorships
 */
export const SET_SPONSORSHIP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SPONSORSHIP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsorship>>
) => {
  client.setQueryData(SPONSORSHIP_QUERY_KEY(...keyParams), response);
};

interface GetSponsorshipParams extends SingleQueryParams {
  sponsorshipId: string;
}

/**
 * @category Queries
 * @group Sponsorships
 */
export const GetSponsorship = async ({
  sponsorshipId,
  adminApiParams,
}: GetSponsorshipParams): Promise<ConnectedXMResponse<Sponsorship>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/sponsorships/${sponsorshipId}`);

  return data;
};
/**
 * @category Hooks
 * @group Sponsorships
 */
export const useGetSponsorship = (
  sponsorshipId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSponsorship>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSponsorship>>(
    SPONSORSHIP_QUERY_KEY(sponsorshipId),
    (params: SingleQueryParams) => GetSponsorship({ sponsorshipId, ...params }),
    {
      ...options,
      enabled: !!sponsorshipId,
    }
  );
};
