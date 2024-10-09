import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, PageType } from "@src/interfaces";
import { Page } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_PAGE_QUERY_KEY = (type: PageType) => ["PAGE", type];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_PAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_PAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationPage>>
) => {
  client.setQueryData(ORGANIZATION_PAGE_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationPageProps extends SingleQueryParams {
  type: PageType;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationPage = async ({
  type,
  adminApiParams,
}: GetOrganizationPageProps): Promise<ConnectedXMResponse<Page>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/pages/${type}`);
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationPage = (
  type: PageType,
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationPage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationPage>>(
    ORGANIZATION_PAGE_QUERY_KEY(type),
    (params: SingleQueryParams) => GetOrganizationPage({ type, ...params }),
    {
      ...options,
      enabled: !!type && (options?.enabled ?? true),
    },
    "org"
  );
};
