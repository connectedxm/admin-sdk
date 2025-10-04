import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Import } from "@src/interfaces";
import { IMPORTS_QUERY_KEY } from "./useGetImports";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Imports
 */
export const IMPORT_QUERY_KEY = (importId: string) => [
  ...IMPORTS_QUERY_KEY(),
  importId,
];

/**
 * @category Setters
 * @group Imports
 */
export const SET_IMPORT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof IMPORT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetImport>>
) => {
  client.setQueryData(IMPORT_QUERY_KEY(...keyParams), response);
};

interface GetImportProps extends SingleQueryParams {
  importId: string;
}

/**
 * @category Queries
 * @group Imports
 */
export const GetImport = async ({
  importId,
  adminApiParams,
}: GetImportProps): Promise<ConnectedXMResponse<Import>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/imports/${importId}`);
  return data;
};
/**
 * @category Hooks
 * @group Imports
 */
export const useGetImport = (
  importId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetImport>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetImport>>(
    IMPORT_QUERY_KEY(importId),
    (params) => GetImport({ importId, ...params }),
    {
      ...options,
      enabled: !!importId,
    }
  );
};
