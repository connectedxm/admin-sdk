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
 * @category Params
 * @group Files
 */
export interface UpdateFileParams extends MutationParams {
  fileId: string;
  file: FileUpdateInputs;
}

/**
 * @category Methods
 * @group Files
 */
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

/**
 * @category Mutations
 * @group Files
 */
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
