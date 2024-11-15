import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Level, ConnectedXMResponse } from "@src/interfaces";
import { LEVELS_QUERY_KEY, SET_LEVEL_QUERY_DATA } from "@src/queries";
import { LevelCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Level
 */
export interface CreateLevelParams extends MutationParams {
  level: LevelCreateInputs;
}

/**
 * @category Methods
 * @group Level
 */
export const CreateLevel = async ({
  level,
  adminApiParams,
  queryClient,
}: CreateLevelParams): Promise<ConnectedXMResponse<Level>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Level>>(
    `/levels`,
    level
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: LEVELS_QUERY_KEY() });
    SET_LEVEL_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Level
 */
export const useCreateLevel = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateLevel>>,
      Omit<CreateLevelParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateLevelParams,
    Awaited<ReturnType<typeof CreateLevel>>
  >(CreateLevel, options, {
    domain: "sponsors",
    type: "create",
  });
};
