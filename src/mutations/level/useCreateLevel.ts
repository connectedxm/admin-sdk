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
 * Endpoint to create a new level within the system.
 * This function allows for the creation of a new level by providing the necessary inputs.
 * It is designed to be used in applications where managing levels is required.
 * @name CreateLevel
 * @param {LevelCreateInputs} level (body) - The inputs required to create a new level
 * @version 1.3
 **/
export interface CreateLevelParams extends MutationParams {
  level: LevelCreateInputs;
}

export const CreateLevel = async ({
  level,
  adminApiParams,
  queryClient,
}: CreateLevelParams): Promise<ConnectedXMResponse<Level>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Level>>(
    `/levels`,
    level
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: LEVELS_QUERY_KEY() });
    SET_LEVEL_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

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