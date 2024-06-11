import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

export const ORGANIZATION_KPI_ACTIVITIES_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "KPI_ACTIVITIES",
];

export const SET_ORGANIZATION_KPI_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_KPI_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationKPIActivities>>
) => {
  client.setQueryData(
    ORGANIZATION_KPI_ACTIVITIES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationKPIActivitiesProps extends SingleQueryParams {}

interface DateCount {
  day: string;
  count: number;
}

export const GetOrganizationKPIActivities = async ({
  adminApiParams,
}: GetOrganizationKPIActivitiesProps): Promise<
  ConnectedXMResponse<DateCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/kpi/activities`);
  return data;
};
export const useGetOrganizationKPIActivities = (
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationKPIActivities>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetOrganizationKPIActivities>
  >(
    ORGANIZATION_KPI_ACTIVITIES_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganizationKPIActivities(params),
    options
  );
};
