import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Sponsorship } from "@src/interfaces";
import { SPONSORSHIPS_QUERY_KEY } from "./useGetSponsorships";
import { QueryClient } from "@tanstack/react-query";

export const SPONSORSHIP_QUERY_KEY = (sponsorshipId: string) => [
  ...SPONSORSHIPS_QUERY_KEY(),
  sponsorshipId,
];

export const SET_SPONSORSHIP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SPONSORSHIP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsorship>>
) => {
  client.setQueryData(SPONSORSHIP_QUERY_KEY(...keyParams), response);
};

interface GetSponsorshipParams {
  sponsorshipId: string;
}

export const GetSponsorship = async ({
  sponsorshipId,
}: GetSponsorshipParams): Promise<ConnectedXMResponse<Sponsorship>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/sponsorships/${sponsorshipId}`);

  return data;
};

const useGetSponsorship = (sponsorshipId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSponsorship>>(
    SPONSORSHIP_QUERY_KEY(sponsorshipId),
    () => GetSponsorship({ sponsorshipId }),
    {
      enabled: !!sponsorshipId,
    }
  );
};

export default useGetSponsorship;
