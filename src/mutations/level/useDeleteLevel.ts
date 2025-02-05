import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { LEVELS_QUERY_KEY, LEVEL_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific level and invalidate related queries.
 * This function allows the removal of a level by its unique identifier and ensures that any cached queries related to levels are invalidated.
 * It is designed to be used in applications where level management is required, ensuring data consistency by updating the cache.
 * @name DeleteLevel
 * @param {string} levelId - The id of the level to be deleted
 * @version 1.2
 **/

/**
 * @category Params
 * @group Level
 */
export interface DeleteLevelParams extends MutationParams {
  levelId: string;
}

/**
 * @category Methods
 * @group Level
 */
export const DeleteLevel = async ({
  levelId,
  adminApiParams,
  queryClient,
}: DeleteLevelParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/levels/${levelId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: LEVELS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: LEVEL_QUERY_KEY(levelId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Level
 */
export const useDeleteLevel = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteLevel>>,
      Omit<DeleteLevelParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteLevelParams,
    Awaited<ReturnType<typeof DeleteLevel>>
  >(DeleteLevel, options, {
    domain: "sponsors",
    type: "del",
  });
};