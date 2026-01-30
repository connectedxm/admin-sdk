import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SEARCHLIST_VALUES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group SearchListValue
 */
export interface DeleteSearchListValueParams extends MutationParams {
  searchListId: string;
  valueId: string;
}

/**
 * @category Methods
 * @group SearchListValue
 */
export const DeleteSearchListValue = async ({
  searchListId,
  valueId,
  adminApiParams,
  queryClient,
}: DeleteSearchListValueParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/searchlists/${searchListId}/values/${valueId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SEARCHLIST_VALUES_QUERY_KEY(searchListId),
    });
    queryClient.removeQueries({
      queryKey: SEARCHLIST_VALUES_QUERY_KEY(searchListId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group SearchListValue
 */
export const useDeleteSearchListValue = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSearchListValue>>,
      Omit<DeleteSearchListValueParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSearchListValueParams,
    Awaited<ReturnType<typeof DeleteSearchListValue>>
  >(DeleteSearchListValue, options);
};
