import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

export const ORGANIZATION_KPI_ACCOUNTS_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "KPI_ACCOUNTS",
];

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

interface GetOrganizationKPIAccountsProps {}

interface DateCount {
  day: string;
  count: number;
}

export const GetOrganizationKPIAccounts =
  async ({}: GetOrganizationKPIAccountsProps) => {
    const adminApi = await GetAdminAPI(adminApiParams);
    const { data } = await adminApi.get(`/organization/kpi/new-accounts`);
    return data;
  };

const useGetOrganizationKPIAccounts = () => {
  return useConnectedSingleQuery<ConnectedXMResponse<DateCount[]>>(
    ORGANIZATION_KPI_ACCOUNTS_QUERY_KEY(),
    () => GetOrganizationKPIAccounts({}),
    {}
  );
};

export default useGetOrganizationKPIAccounts;
