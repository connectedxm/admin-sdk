import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SearchList, ConnectedXMResponse } from "@src/interfaces";
import { SEARCHLISTS_QUERY_KEY, SET_SEARCHLIST_QUERY_DATA } from "@src/queries";
import { SearchListCreateInputs } from "@src/params";

/**
 * @category Params
 * @group SearchList
 */
export interface CreateSearchListParams extends MutationParams {
  searchList: SearchListCreateInputs;
}

/**
 * @category Methods
 * @group SearchList
 */
export const CreateSearchList = async ({
  searchList,
  adminApiParams,
  queryClient,
}: CreateSearchListParams): Promise<ConnectedXMResponse<SearchList>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<SearchList>>(
    `/searchlists`,
    searchList
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SEARCHLISTS_QUERY_KEY() });
    SET_SEARCHLIST_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group SearchList
 */
export const useCreateSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSearchList>>,
      Omit<CreateSearchListParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSearchListParams,
    Awaited<ReturnType<typeof CreateSearchList>>
  >(CreateSearchList, options);
};
