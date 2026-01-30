import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SearchListValue, ConnectedXMResponse } from "@src/interfaces";
import {
  SEARCHLIST_VALUES_QUERY_KEY,
  SET_SEARCHLIST_VALUE_QUERY_DATA,
} from "@src/queries";
import { SearchListValueCreateInputs } from "@src/params";

/**
 * @category Params
 * @group SearchListValue
 */
export interface CreateSearchListValueParams extends MutationParams {
  searchListId: string;
  value: SearchListValueCreateInputs;
}

/**
 * @category Methods
 * @group SearchListValue
 */
export const CreateSearchListValue = async ({
  searchListId,
  value,
  adminApiParams,
  queryClient,
}: CreateSearchListValueParams): Promise<
  ConnectedXMResponse<SearchListValue>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<SearchListValue>>(
    `/searchlists/${searchListId}/values`,
    value
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SEARCHLIST_VALUES_QUERY_KEY(searchListId),
    });
    SET_SEARCHLIST_VALUE_QUERY_DATA(
      queryClient,
      [searchListId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group SearchListValue
 */
export const useCreateSearchListValue = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSearchListValue>>,
      Omit<CreateSearchListValueParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSearchListValueParams,
    Awaited<ReturnType<typeof CreateSearchListValue>>
  >(CreateSearchListValue, options);
};
