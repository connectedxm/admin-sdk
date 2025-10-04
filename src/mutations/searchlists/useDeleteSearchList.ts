import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SEARCHLISTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group SearchList
 */
export interface DeleteSearchListParams extends MutationParams {
  searchListId: string;
}

/**
 * @category Methods
 * @group SearchList
 */
export const DeleteSearchList = async ({
  searchListId,
  adminApiParams,
  queryClient,
}: DeleteSearchListParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/searchlists/${searchListId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SEARCHLISTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: SEARCHLISTS_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group SearchList
 */
export const useDeleteSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSearchList>>,
      Omit<DeleteSearchListParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSearchListParams,
    Awaited<ReturnType<typeof DeleteSearchList>>
  >(DeleteSearchList, options);
};
