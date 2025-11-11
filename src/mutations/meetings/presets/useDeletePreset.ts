import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { PRESETS_QUERY_KEY, PRESET_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group StreamsV2
 */
export interface DeletePresetParams extends MutationParams {
  presetId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const DeletePreset = async ({
  presetId,
  adminApiParams,
  queryClient,
}: DeletePresetParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/meetings/presets/${presetId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: PRESETS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: PRESET_QUERY_KEY(presetId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useDeletePreset = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeletePreset>>,
      Omit<DeletePresetParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeletePresetParams,
    Awaited<ReturnType<typeof DeletePreset>>
  >(DeletePreset, options);
};
