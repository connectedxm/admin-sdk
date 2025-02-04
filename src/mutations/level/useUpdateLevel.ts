import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Level, ConnectedXMResponse } from "@src/interfaces";
import { LEVELS_QUERY_KEY, SET_LEVEL_QUERY_DATA } from "@src/queries";
import { LevelUpdateInputs } from "@src/params";

/**
 * Endpoint to update a level with new data.
 * This function allows updating the details of a specific level by providing new data.
 * It is used in scenarios where level information needs to be modified.
 * @name UpdateLevel
 * @param {string} levelId - The id of the level
 * @param {LevelUpdateInputs} level - The new data for the level
 * @version 1.2
 **/

export interface UpdateLevelParams extends MutationParams {
  levelId: string;
  level: LevelUpdateInputs;
}

export const UpdateLevel = async ({
  levelId,
  level,
  adminApiParams,
  queryClient,
}: UpdateLevelParams): Promise<ConnectedXMResponse<Level>> => {
  if (!levelId) throw new Error("Level ID undefined");
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<Level>>(
    `/levels/${levelId}`,
    {
      ...level,
      id: undefined,
      image: undefined,
      accounts: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: LEVELS_QUERY_KEY() });
    SET_LEVEL_QUERY_DATA(queryClient, [levelId || data.data?.id], data);
  }
  return data;
};

export const useUpdateLevel = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateLevel>>,
      Omit<UpdateLevelParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateLevelParams,
    Awaited<ReturnType<typeof UpdateLevel>>
  >(UpdateLevel, options, {
    domain: "sponsors",
    type: "update",
  });
};