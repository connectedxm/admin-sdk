import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, Import } from "@src/interfaces";
import { IMPORTS_QUERY_KEY } from "@src/queries";
import { ImportCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Imports
 */
export interface CreateImportParams extends MutationParams {
  import: ImportCreateInputs;
  messageData?: {
    tierId?: string | null;
  };
}

/**
 * @category Methods
 * @group Imports
 */
export const CreateImport = async ({
  import: { values, type },
  messageData,
  adminApiParams,
  queryClient,
}: CreateImportParams): Promise<ConnectedXMResponse<Import>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Import>>(
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

/**
 * @category Mutations
 * @group Imports
 */
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
  >(CreateImport, options);
};
