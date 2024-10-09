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
 * @category Params
 * @group Level
 */
export interface UpdateLevelParams extends MutationParams {
  levelId: string;
  level: LevelUpdateInputs;
}

/**
 * @category Methods
 * @group Level
 */
export const UpdateLevel = async ({
  levelId,
  level,
  adminApiParams,
  queryClient,
}: UpdateLevelParams): Promise<ConnectedXMResponse<Level>> => {
  if (!levelId) throw new Error("Level ID undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<Level>>(
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

/**
 * @category Mutations
 * @group Level
 */
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
    domain: "levels",
    type: "update",
  });
};
