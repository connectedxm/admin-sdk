import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { Preset, ConnectedXMResponse } from "@src/interfaces";
import { PRESETS_QUERY_KEY, SET_PRESET_QUERY_DATA } from "@src/queries";
import { MeetingPresetCreateInputs } from "@src/params";

/**
 * @category Params
 * @group StreamsV2
 */
export interface CreatePresetParams extends MutationParams {
  preset: MeetingPresetCreateInputs;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const CreatePreset = async ({
  preset,
  adminApiParams,
  queryClient,
}: CreatePresetParams): Promise<ConnectedXMResponse<Preset>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Preset>>(
    `/streams/v2/presets`,
    preset
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: PRESETS_QUERY_KEY() });
    SET_PRESET_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useCreatePreset = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreatePreset>>,
      Omit<CreatePresetParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreatePresetParams,
    Awaited<ReturnType<typeof CreatePreset>>
  >(CreatePreset, options);
};
