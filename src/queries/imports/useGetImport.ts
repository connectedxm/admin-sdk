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
 * Provides functionality for retrieving and managing import data within the application.
 * This module includes methods to fetch import details by ID and update the query cache with the retrieved data.
 * It is designed to be used in scenarios where import data needs to be accessed or manipulated.
 * @name GetImport
 * @param {string} importId - The id of the import
 * @version 1.2
 **/

export const IMPORT_QUERY_KEY = (importId: string) => [
  ...IMPORTS_QUERY_KEY(),
  importId,
];

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

export const GetImport = async ({
  importId,
  adminApiParams,
}: GetImportProps): Promise<ConnectedXMResponse<Import>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/imports/${importId}`);
  return data;
};

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
    },
    "org"
  );
};