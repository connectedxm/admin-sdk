import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Import } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { TIER_IMPORTS_QUERY_KEY } from "./useGetTierImports";

/**
 * @category Keys
 * @group Imports
 */
export const TIER_IMPORT_QUERY_KEY = (tierId: string, importId: string) => [
  ...TIER_IMPORTS_QUERY_KEY(tierId),
  importId,
];

/**
 * @category Setters
 * @group Imports
 */
export const SET_TIER_IMPORT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TIER_IMPORT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTierImport>>
) => {
  client.setQueryData(TIER_IMPORT_QUERY_KEY(...keyParams), response);
};

interface GetTierImportProps extends SingleQueryParams {
  tierId: string;
  importId: string;
}

/**
 * @category Queries
 * @group Imports
 */
export const GetTierImport = async ({
  tierId,
  importId,
  adminApiParams,
}: GetTierImportProps): Promise<ConnectedXMResponse<Import>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/tiers/${tierId}/imports/${importId}`);
  return data;
};
/**
 * @category Hooks
 * @group Imports
 */
export const useGetTierImport = (
  tierId: string = "",
  importId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetTierImport>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetTierImport>>(
    TIER_IMPORT_QUERY_KEY(tierId, importId),
    (params) => GetTierImport({ tierId, importId, ...params }),
    {
      ...options,
      enabled: !!tierId && !!importId && (options.enabled ?? true),
    }
  );
};
