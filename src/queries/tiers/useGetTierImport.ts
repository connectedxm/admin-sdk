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
 * Endpoint to retrieve a specific import associated with a tier by its unique identifiers.
 * This function allows users to fetch details of a particular import within a specified tier.
 * It is designed to be used in applications where detailed information about tier imports is required.
 * @name GetTierImport
 * @param {string} tierId - The id of the tier
 * @param {string} importId - The id of the import
 * @version 1.2
 **/

export const TIER_IMPORT_QUERY_KEY = (tierId: string, importId: string) => [
  ...TIER_IMPORTS_QUERY_KEY(tierId),
  importId,
];

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

export const GetTierImport = async ({
  tierId,
  importId,
  adminApiParams,
}: GetTierImportProps): Promise<ConnectedXMResponse<Import>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/tiers/${tierId}/imports/${importId}`);
  return data;
};

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
    },
    "org"
  );
};