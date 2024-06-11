import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipPurchase } from "@src/interfaces";
import { SPONSORSHIP_QUERY_KEY } from "./useGetSponsorship";
import { QueryClient } from "@tanstack/react-query";

export const SPONSORSHIP_PURCHASES_QUERY_KEY = (sponsorshipId: string) => [
  ...SPONSORSHIP_QUERY_KEY(sponsorshipId),
  "PURCHASES",
];

export const SET_SPONSORSHIP_PURCHASES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SPONSORSHIP_PURCHASES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsorshipPurchases>>
) => {
  client.setQueryData(SPONSORSHIP_PURCHASES_QUERY_KEY(...keyParams), response);
};

interface GetSponsorshipPurchasesParams extends InfiniteQueryParams {
  sponsorshipId: string;
}

export const GetSponsorshipPurchases = async ({
  sponsorshipId,
  search,
  adminApiParams,
}: GetSponsorshipPurchasesParams): Promise<
  ConnectedXMResponse<SponsorshipPurchase[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/sponsorships/${sponsorshipId}/purchases`,
    {
      params: { search: search || undefined },
    }
  );

  return data;
};

const useGetSponsorshipPurchases = (
  sponsorshipId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSponsorshipPurchases>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSponsorshipPurchases>>
  >(
    SPONSORSHIP_PURCHASES_QUERY_KEY(sponsorshipId),
    (params: InfiniteQueryParams) =>
      GetSponsorshipPurchases({ ...params, sponsorshipId }),
    params,
    {
      ...options,
      enabled: !!sponsorshipId,
    }
  );
};

export default useGetSponsorshipPurchases;
