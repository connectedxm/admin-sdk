import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, ImportItem, Tier } from "@src/interfaces";
import { IMPORTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Imports
 */
export interface CreateImportParams extends MutationParams {
  values: any[];
  messageData: Record<string, any>;
  //TODO: missing interface and validation
  type: ImportItem;
}

/**
 * @category Methods
 * @group Imports
 */
export const CreateImport = async ({
  values,
  messageData,
  type,
  adminApiParams,
  queryClient,
}: CreateImportParams): Promise<ConnectedXMResponse<Tier>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Tier>>(
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
