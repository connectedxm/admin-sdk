import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, File } from "@src/interfaces";
import { FILES_QUERY_KEY, SET_FILE_QUERY_DATA } from "@src/queries";
import { FileUpdateInputs } from "@src/params";

/**
 * Endpoint to update a specific file within the system.
 * This function allows users to update the details of a file by providing the file ID and the new file data.
 * It is designed to be used in applications where file management and updates are required.
 * @name UpdateFile
 * @param {string} fileId (path) - The ID of the file to be updated
 * @param {FileUpdateInputs} file (body) - The inputs for updating the file
 * @version 1.3
**/
export interface UpdateFileParams extends MutationParams {
  fileId: string;
  file: FileUpdateInputs;
}

export const UpdateFile = async ({
  fileId,
  file,
  adminApiParams,
  queryClient,
}: UpdateFileParams): Promise<ConnectedXMResponse<File>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<File>>(
    `/files/${fileId}`,
    file
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: FILES_QUERY_KEY() });
    SET_FILE_QUERY_DATA(queryClient, [data?.data?.id.toString()], data);
  }
  return data;
};

export const useUpdateFile = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateFile>>,
      Omit<UpdateFileParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateFileParams,
    Awaited<ReturnType<typeof UpdateFile>>
  >(UpdateFile, options, {
    domain: "storage",
    type: "update",
  });
};