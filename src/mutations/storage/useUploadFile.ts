import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, File } from "@src/interfaces";

/**
 * @category Params
 * @group Storage
 */
export interface UploadFileParams extends MutationParams {
  dataUri: string;
  source: "admin" | "response";
  name?: string;
}

/**
 * @category Methods
 * @group Storage
 */
export const UploadFile = async ({
  dataUri,
  source,
  name,
  // queryClient,
  adminApiParams,
}: UploadFileParams): Promise<ConnectedXMResponse<File>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<File>>(`/files`, {
    dataUri,
    source,
    name,
  });
  // if(queryClient && data.status === "ok") { }
  return data;
};

/**
 * @category Mutations
 * @group Storage
 */
export const useUploadFile = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UploadFile>>,
      Omit<UploadFileParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UploadFileParams,
    Awaited<ReturnType<typeof UploadFile>>
  >(UploadFile, options);
};
