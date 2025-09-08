import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SearchList, ConnectedXMResponse } from "@src/interfaces";
import { SEARCHLISTS_QUERY_KEY, SET_SEARCHLIST_QUERY_DATA } from "@src/queries";
import { SearchListUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group SearchList
 */
export interface UpdateSearchListParams extends MutationParams {
  searchListId: string;
  searchList: SearchListUpdateInputs;
}

/**
 * @category Methods
 * @group SearchList
 */
export const UpdateSearchList = async ({
  searchListId,
  searchList,
  adminApiParams,
  queryClient,
}: UpdateSearchListParams): Promise<ConnectedXMResponse<SearchList>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<SearchList>>(
    `/searchlists/${searchListId}`,
    searchList
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SEARCHLISTS_QUERY_KEY() });
    SET_SEARCHLIST_QUERY_DATA(queryClient, [searchListId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group SearchList
 */
export const useUpdateSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSearchList>>,
      Omit<UpdateSearchListParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSearchListParams,
    Awaited<ReturnType<typeof UpdateSearchList>>
  >(UpdateSearchList, options, {
    domain: "searchlists",
    type: "update",
  });
};
