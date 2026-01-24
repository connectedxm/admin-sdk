import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { AccountAttribute } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { ORGANIZATION_QUERY_KEY } from "../useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "ACCOUNT_ATTRIBUTES",
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationAccountAttributes>>
) => {
  client.setQueryData(
    ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationAccountAttributesProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationAccountAttributes = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetOrganizationAccountAttributesProps): Promise<
  ConnectedXMResponse<AccountAttribute[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/attributes`, {
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
export const useGetOrganizationAccountAttributes = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationAccountAttributes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationAccountAttributes>>
  >(
    ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetOrganizationAccountAttributes(params),
    params,
    options
  );
};
