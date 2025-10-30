import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { MeetingPreset, ConnectedXMResponse } from "@src/interfaces";
import { PRESETS_QUERY_KEY, SET_PRESET_QUERY_DATA } from "@src/queries";
import { MeetingPresetUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group StreamsV2
 */
export interface UpdatePresetParams extends MutationParams {
  presetId: string;
  preset: MeetingPresetUpdateInputs;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const UpdatePreset = async ({
  presetId,
  preset,
  adminApiParams,
  queryClient,
}: UpdatePresetParams): Promise<ConnectedXMResponse<MeetingPreset>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.patch<ConnectedXMResponse<MeetingPreset>>(
    `/streams/v2/presets/${presetId}`,
    preset
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: PRESETS_QUERY_KEY() });
    SET_PRESET_QUERY_DATA(queryClient, [presetId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useUpdatePreset = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdatePreset>>,
      Omit<UpdatePresetParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdatePresetParams,
    Awaited<ReturnType<typeof UpdatePreset>>
  >(UpdatePreset, options);
};
