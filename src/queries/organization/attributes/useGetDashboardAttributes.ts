import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { AccountAttribute } from "@src/interfaces";
import {
  SingleQueryParams,
  SingleQueryOptions,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ORGANIZATION_QUERY_KEY } from "../useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const DASHBOARD_ATTRIBUTES_QUERY_KEY = (
  search?: string
) => [
  ...ORGANIZATION_QUERY_KEY(),
  "DASHBOARD_ATTRIBUTES",
  search || "",
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_DASHBOARD_ATTRIBUTES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof DASHBOARD_ATTRIBUTES_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetDashboardAttributes>>
) => {
  client.setQueryData(
    DASHBOARD_ATTRIBUTES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetDashboardAttributesProps
  extends SingleQueryParams {
  search?: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetDashboardAttributes = async ({
  search,
  adminApiParams,
}: GetDashboardAttributesProps): Promise<
  ConnectedXMResponse<AccountAttribute[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/attributes/dashboard`, {
    params: {
      search: search || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useGetDashboardAttributes = (
  search?: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetDashboardAttributes>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetDashboardAttributes>
  >(
    DASHBOARD_ATTRIBUTES_QUERY_KEY(search),
    (params: SingleQueryParams) =>
      GetDashboardAttributes({ ...params, search }),
    options
  );
};

