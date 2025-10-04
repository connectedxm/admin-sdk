import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SearchListValue } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SEARCHLIST_VALUES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group SearchList-Values
 */
export interface BulkUploadSearchListValuesParams extends MutationParams {
  searchListId: string;
  values: string[];
}

/**
 * @category Methods
 * @group SearchList-Values
 */
export const BulkUploadSearchListValues = async ({
  searchListId,
  values,
  adminApiParams,
  queryClient,
}: BulkUploadSearchListValuesParams): Promise<
  ConnectedXMResponse<SearchListValue[]>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<SearchListValue[]>
  >(`/searchlists/${searchListId}/values/bulk`, {
    values,
  });

  if (queryClient && data.status === "ok") {
    // Invalidate the searchlist values query to refresh the data
    queryClient.invalidateQueries({
      queryKey: SEARCHLIST_VALUES_QUERY_KEY(searchListId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group SearchList-Values
 */
export const useBulkUploadSearchListValues = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof BulkUploadSearchListValues>>,
      Omit<BulkUploadSearchListValuesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    BulkUploadSearchListValuesParams,
    Awaited<ReturnType<typeof BulkUploadSearchListValues>>
  >(BulkUploadSearchListValues, options);
};
