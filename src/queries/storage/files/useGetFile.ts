import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { File } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { FILES_QUERY_KEY } from "./useGetFiles";

/**
 * @category Keys
 * @group Files
 */
export const FILE_QUERY_KEY = (fileId: string) => [
  ...FILES_QUERY_KEY(),
  fileId,
];

/**
 * @category Setters
 * @group Files
 */
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

/**
 * @category Queries
 * @group Files
 */
export const GetFile = async ({
  fileId,
  adminApiParams,
}: GetFileParams): Promise<ConnectedXMResponse<File>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/files/${fileId}`);

  return data;
};
/**
 * @category Hooks
 * @group Files
 */
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
