import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { FILES_QUERY_KEY, FILE_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Files
 */
export interface DeleteFileParams extends MutationParams {
  fileId: string;
}

/**
 * @category Methods
 * @group Files
 */
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

/**
 * @category Mutations
 * @group Files
 */
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
