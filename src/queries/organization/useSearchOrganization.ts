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
export const SEARCH_ORGANIZATION_QUERY_KEY = (
  search?: string,
  filters?: SearchOrganizationFilters
) => [
  "SEARCH_ORGANIZATION",
  search ?? "",
  ...(filters ? [JSON.stringify(filters)] : []),
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

export interface SearchOrganizationFilters {
  accounts?: boolean;
  events?: boolean;
  groups?: boolean;
  channels?: boolean;
  contents?: boolean;
  threads?: boolean;
}

interface SearchOrganizationProps extends SingleQueryParams {
  search?: string;
  filters?: SearchOrganizationFilters;
}

/**
 * @category Queries
 * @group Organization
 */
export const SearchOrganization = async ({
  search,
  filters,
  adminApiParams,
}: SearchOrganizationProps): Promise<ConnectedXMResponse<SearchField[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/search`, {
    params: {
      search: search,
      ...filters,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useSearchOrganization = (
  search?: string,
  filters?: SearchOrganizationFilters,
  options: SingleQueryOptions<ReturnType<typeof SearchOrganization>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof SearchOrganization>>(
    SEARCH_ORGANIZATION_QUERY_KEY(search, filters),
    (params: SingleQueryParams) =>
      SearchOrganization({ ...params, search, filters }),
    {
      ...options,
      enabled: !!search && (options.enabled ?? true),
    },
    "org"
  );
};
