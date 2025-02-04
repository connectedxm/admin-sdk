import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, File } from "@src/interfaces";

/**
 * Endpoint to upload a file to storage.
 * This function allows users to upload a file by providing its data URI and source.
 * It is designed to be used in applications where file storage is required.
 * @name UploadFile
 * @param {string} dataUri - The data URI of the file
 * @param {"admin" | "response"} source - The source of the file
 * @param {string} [name] - Optional name of the file
 * @version 1.2
 **/
export interface UploadFileParams extends MutationParams {
  dataUri: string;
  source: "admin" | "response";
  name?: string;
}

export const UploadFile = async ({
  dataUri,
  source,
  name,
  adminApiParams,
}: UploadFileParams): Promise<ConnectedXMResponse<File>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<File>>(`/files`, {
    dataUri,
    source,
    name,
  });
  return data;
};

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
  >(UploadFile, options, {
    domain: "storage",
    type: "update",
  });
};