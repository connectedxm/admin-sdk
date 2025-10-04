import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SearchListValue, ConnectedXMResponse } from "@src/interfaces";
import {
  SEARCHLIST_VALUES_QUERY_KEY,
  SET_SEARCHLIST_VALUE_QUERY_DATA,
} from "@src/queries";
import { SearchListValueUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group SearchListValue
 */
export interface UpdateSearchListValueParams extends MutationParams {
  searchListId: string;
  valueId: string;
  value: SearchListValueUpdateInputs;
}

/**
 * @category Methods
 * @group SearchListValue
 */
export const UpdateSearchListValue = async ({
  searchListId,
  valueId,
  value,
  adminApiParams,
  queryClient,
}: UpdateSearchListValueParams): Promise<
  ConnectedXMResponse<SearchListValue>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<SearchListValue>>(
    `/searchlists/${searchListId}/values/${valueId}`,
    value
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SEARCHLIST_VALUES_QUERY_KEY(searchListId),
    });
    SET_SEARCHLIST_VALUE_QUERY_DATA(queryClient, [searchListId, valueId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group SearchListValue
 */
export const useUpdateSearchListValue = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSearchListValue>>,
      Omit<UpdateSearchListValueParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSearchListValueParams,
    Awaited<ReturnType<typeof UpdateSearchListValue>>
  >(UpdateSearchListValue, options);
};
