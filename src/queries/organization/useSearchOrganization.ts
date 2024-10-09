import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, SearchField } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const SEARCH_ORGANIZATION_QUERY_KEY = (search?: string) => [
  "SEARCH_ORGANIZATION",
  search ?? "",
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_SEARCH_ORGANIZATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SEARCH_ORGANIZATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof SearchOrganization>>
) => {
  client.setQueryData(SEARCH_ORGANIZATION_QUERY_KEY(...keyParams), response);
};

interface SearchOrganizationProps extends SingleQueryParams {
  search?: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const SearchOrganization = async ({
  search,
  adminApiParams,
}: SearchOrganizationProps): Promise<ConnectedXMResponse<SearchField[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/search`, {
    params: { search: search },
  });
  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useSearchOrganization = (
  search?: string,
  options: SingleQueryOptions<ReturnType<typeof SearchOrganization>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof SearchOrganization>>(
    SEARCH_ORGANIZATION_QUERY_KEY(search),
    (params: SingleQueryParams) => SearchOrganization({ ...params, search }),
    {
      ...options,
      enabled: !!search && (options.enabled ?? true),
    },
    "org"
  );
};
