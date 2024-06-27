import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SponsorshipLevel, ConnectedXMResponse } from "@src/interfaces";
import { LEVELS_QUERY_KEY, SET_LEVEL_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Level
 */
export interface UpdateLevelParams extends MutationParams {
  levelId: string;
  level: SponsorshipLevel;
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
}: UpdateLevelParams): Promise<ConnectedXMResponse<SponsorshipLevel>> => {
  if (!levelId) throw new Error("Level ID undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<SponsorshipLevel>>(
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
  >(UpdateLevel, options);
};
