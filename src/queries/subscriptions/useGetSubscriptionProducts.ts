import { ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionProduct } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const SUBSCRIPTION_PRODUCTS_QUERY_KEY = () => ["SUBSCRIPTION_PRODUCTS"];

export const SET_SUBSCRIPTION_PRODUCTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTION_PRODUCTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscriptionProducts>>
) => {
  client.setQueryData(SUBSCRIPTION_PRODUCTS_QUERY_KEY(...keyParams), response);
};

interface GetSubscriptionProductsProps extends InfiniteQueryParams {}

export const GetSubscriptionProducts = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetSubscriptionProductsProps): Promise<
  ConnectedXMResponse<SubscriptionProduct[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/subscription-products`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetSubscriptionProducts = () => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSubscriptionProducts>>
  >(
    SUBSCRIPTION_PRODUCTS_QUERY_KEY(),
    (params: any) => GetSubscriptionProducts(params),
    {},
    {}
  );
};

export default useGetSubscriptionProducts;
