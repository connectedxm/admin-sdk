import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipPurchase } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { SPONSORSHIP_PURCHASES_QUERY_KEY } from "./useGetSponsorshipPurchases";

export const SPONSORSHIP_PURCHASE_QUERY_KEY = (
  sponsorshipId: string,
  purchaseId: string
) => [...SPONSORSHIP_PURCHASES_QUERY_KEY(sponsorshipId), purchaseId];

export const SET_SPONSORSHIP_PURCHASE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SPONSORSHIP_PURCHASE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsorshipPurchase>>
) => {
  client.setQueryData(SPONSORSHIP_PURCHASE_QUERY_KEY(...keyParams), response);
};

interface GetSponsorshipPurchaseParams {
  sponsorshipId: string;
  purchaseId: string;
}

export const GetSponsorshipPurchase = async ({
  sponsorshipId,
  purchaseId,
}: GetSponsorshipPurchaseParams): Promise<
  ConnectedXMResponse<SponsorshipPurchase>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/sponsorships/${sponsorshipId}/purchases/${purchaseId}`
  );

  return data;
};

const useGetSponsorshipPurchase = (
  sponsorshipId: string,
  purchaseId: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSponsorshipPurchase>>((
    SPONSORSHIP_PURCHASE_QUERY_KEY(sponsorshipId, purchaseId),
    () => GetSponsorshipPurchase({ sponsorshipId, purchaseId }),
    {
      enabled: !!sponsorshipId,
    }
  );
};

export default useGetSponsorshipPurchase;
