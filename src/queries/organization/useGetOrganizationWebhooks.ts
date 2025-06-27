import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Webhook } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_WEBHOOKS_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "WEBHOOKS",
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_WEBHOOKS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_WEBHOOKS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationWebhooks>>
) => {
  client.setQueryData(ORGANIZATION_WEBHOOKS_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationWebhooksProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationWebhooks = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetOrganizationWebhooksProps): Promise<ConnectedXMResponse<Webhook[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/webhooks`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationWebhooks = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationWebhooks>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationWebhooks>>
  >(
    ORGANIZATION_WEBHOOKS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetOrganizationWebhooks(params),
    params,
    options,
    "org"
  );
};
