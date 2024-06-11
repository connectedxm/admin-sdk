import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_KPI_ACCOUNTS_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "KPI_ACCOUNTS",
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_KPI_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_KPI_ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationKPIAccounts>>
) => {
  client.setQueryData(
    ORGANIZATION_KPI_ACCOUNTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationKPIAccountsProps extends SingleQueryParams {}

interface DateCount {
  day: string;
  count: number;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationKPIAccounts = async ({
  adminApiParams,
}: GetOrganizationKPIAccountsProps): Promise<
  ConnectedXMResponse<DateCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/kpi/new-accounts`);
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationKPIAccounts = (
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationKPIAccounts>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationKPIAccounts>>(
    ORGANIZATION_KPI_ACCOUNTS_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganizationKPIAccounts(params),
    options
  );
};
