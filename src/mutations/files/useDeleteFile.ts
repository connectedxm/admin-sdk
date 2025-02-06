import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { FILES_QUERY_KEY, FILE_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific file by its unique identifier.
 * This function allows users to remove a file from the system, ensuring that all related queries are invalidated.
 * It is designed to be used in applications where file management and cleanup are required.
 * @name DeleteFile
 * @param {string} fileId (path) - The id of the file to be deleted
 * @version 1.3
 **/
export interface DeleteFileParams extends MutationParams {
  fileId: string;
}

export const DeleteFile = async ({
  fileId,
  adminApiParams,
  queryClient,
}: DeleteFileParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/files/${fileId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: FILES_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: FILE_QUERY_KEY(fileId) });
  }
  return data;
};

export const useDeleteFile = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteFile>>,
      Omit<DeleteFileParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteFileParams,
    Awaited<ReturnType<typeof DeleteFile>>
  >(DeleteFile, options, {
    domain: "storage",
    type: "del",
  });
};