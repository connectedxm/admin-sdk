import { GetAdminAPI } from "@src/AdminAPI";
import { QueryClient } from "@tanstack/react-query";
import { PURCHASES_QUERY_KEY } from "./useGetPurchases";
import {
  SingleQueryParams,
  SingleQueryOptions,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";

/**
 * @category Keys
 * @group Purchases
 */
export const PURCHASE_QUERY_KEY = (purchaseId: string) => [
  ...PURCHASES_QUERY_KEY(),
  purchaseId,
];

/**
 * @category Setters
 * @group Purchases
 */
export const SET_PURCHASE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PURCHASE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPurchase>>
) => {
  client.setQueryData(PURCHASE_QUERY_KEY(...keyParams), response);
};

interface GetPurchaseProps extends SingleQueryParams {
  purchaseId: string;
}

/**
 * @category Queries
 * @group Purchases
 */
export const GetPurchase = async ({
  purchaseId,
  adminApiParams,
}: GetPurchaseProps): Promise<ConnectedXMResponse<Purchase>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<Purchase>>(
    `/purchases/${purchaseId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Purchases
 */
export const useGetPurchase = (
  purchaseId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetPurchase>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetPurchase>>(
    PURCHASE_QUERY_KEY(purchaseId),
    (params: SingleQueryParams) =>
      GetPurchase({
        purchaseId,
        ...params,
      }),
    {
      ...options,
      enabled: !!purchaseId && (options.enabled ?? true),
    }
  );
};
