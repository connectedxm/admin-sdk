import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { SUBSCRIPTION_PRODUCT_QUERY_KEY } from "./useGetSubscriptionProduct";

export const SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY = (
  subscriptionProductId: string
) => [
  ...SUBSCRIPTION_PRODUCT_QUERY_KEY(subscriptionProductId),
  "SUBSCRIPTION_PRODUCT_TIERS",
];

export const SET_SUBSCRIPTION_PRODUCT_TIERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscriptionProductTiers>>
) => {
  client.setQueryData(
    SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSubscriptionProductTiersProps extends InfiniteQueryParams {
  subscriptionProductId: string;
}

export const GetSubscriptionProductTiers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  subscriptionProductId,
}: GetSubscriptionProductTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${subscriptionProductId}/tiers`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

const useGetSubscriptionProductTiers = (subscriptionProductId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSubscriptionProductTiers>>
  >(
    SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY(subscriptionProductId),
    (params: any) =>
      GetSubscriptionProductTiers({ ...params, subscriptionProductId }),
    {},
    {}
  );
};

export default useGetSubscriptionProductTiers;
