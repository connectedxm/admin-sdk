import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { AccountAttribute } from "@src/interfaces";
import {
  SingleQueryParams,
  SingleQueryOptions,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const REQUIRED_ATTRIBUTES_QUERY_KEY = (search?: string) => [
  ...ORGANIZATION_QUERY_KEY(),
  "REQUIRED_ATTRIBUTES",
  search || "",
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_REQUIRED_ATTRIBUTES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof REQUIRED_ATTRIBUTES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetRequiredAttributes>>
) => {
  client.setQueryData(REQUIRED_ATTRIBUTES_QUERY_KEY(...keyParams), response);
};

interface GetRequiredAttributesProps extends SingleQueryParams {
  search?: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetRequiredAttributes = async ({
  search,
  adminApiParams,
}: GetRequiredAttributesProps): Promise<
  ConnectedXMResponse<AccountAttribute[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/attributes/required`, {
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
export const useGetRequiredAttributes = (
  search?: string,
  options: SingleQueryOptions<ReturnType<typeof GetRequiredAttributes>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetRequiredAttributes>>(
    REQUIRED_ATTRIBUTES_QUERY_KEY(search),
    (params: SingleQueryParams) => GetRequiredAttributes({ ...params, search }),
    options
  );
};
