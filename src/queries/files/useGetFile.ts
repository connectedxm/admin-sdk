import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { File } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { FILES_QUERY_KEY } from "./useGetFiles";

/**
 * Endpoint to retrieve a specific file by its unique identifier.
 * This function allows users to fetch details of a file using the provided file ID.
 * It is designed to be used in applications where detailed information about a file is required.
 * @name GetFile
 * @param {string} fileId (path) - The ID of the file
 * @version 1.3
 **/

export const FILE_QUERY_KEY = (fileId: string) => [
  ...FILES_QUERY_KEY(),
  fileId,
];

export const SET_FILE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof FILE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetFile>>
) => {
  client.setQueryData(FILE_QUERY_KEY(...keyParams), response);
};

interface GetFileParams extends SingleQueryParams {
  fileId: string;
}

export const GetFile = async ({
  fileId,
  adminApiParams,
}: GetFileParams): Promise<ConnectedXMResponse<File>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/files/${fileId}`);

  return data;
};

export const useGetFile = (
  fileId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetFile>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetFile>>(
    FILE_QUERY_KEY(fileId),
    (params: SingleQueryParams) => GetFile({ fileId, ...params }),
    {
      ...options,
      enabled: !!fileId && (options?.enabled ?? true),
    }
  );
};