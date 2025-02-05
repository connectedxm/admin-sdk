import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Import } from "@src/interfaces";
import { IMPORTS_QUERY_KEY } from "@src/queries";
import { ImportCreateInputs } from "@src/params";

/**
 * Endpoint to create a new import within the system.
 * This function allows users to initiate the creation of an import by providing necessary import data inputs.
 * It supports optional message data, including a tier ID, to customize the import process.
 * @name CreateImport
 * @param {ImportCreateInputs} import - The import data inputs
 * @param {Object} [messageData] - Optional message data
 * @param {string} [messageData.tierId] - Optional tier ID
 * @version 1.2
 **/

export interface CreateImportParams extends MutationParams {
  import: ImportCreateInputs;
  messageData?: {
    tierId?: string | null;
  };
}

export const CreateImport = async ({
  import: { values, type },
  messageData,
  adminApiParams,
  queryClient,
}: CreateImportParams): Promise<ConnectedXMResponse<Import>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Import>>(
    `/imports/${type}`,
    {
      values,
      messageData,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: IMPORTS_QUERY_KEY() });
  }
  return data;
};

export const useCreateImport = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateImport>>,
      Omit<CreateImportParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateImportParams,
    Awaited<ReturnType<typeof CreateImport>>
  >(CreateImport, options, {
    domain: "org",
    type: "update",
  });
};