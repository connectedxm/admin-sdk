import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

export const ORGANIZATION_KPI_SALES_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "KPI_SALES",
];

export const SET_ORGANIZATION_KPI_SALES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_KPI_SALES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationKPISales>>
) => {
  client.setQueryData(ORGANIZATION_KPI_SALES_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationKPISalesProps extends SingleQueryParams {}

interface DateSumCount {
  day: string;
  registrations: number;
  revenue: number;
}

export const GetOrganizationKPISales = async ({
  adminApiParams,
}: GetOrganizationKPISalesProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/kpi/sales`);
  return data;
};
export const useGetOrganizationKPISales = (
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationKPISales>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationKPISales>>(
    ORGANIZATION_KPI_SALES_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganizationKPISales(params),
    options
  );
};
