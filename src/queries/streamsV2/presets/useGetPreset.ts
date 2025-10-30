import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, MeetingPreset } from "@src/interfaces";
import { PRESETS_QUERY_KEY } from "./useGetPresets";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const PRESET_QUERY_KEY = (presetId: string) => [
  ...PRESETS_QUERY_KEY(),
  presetId,
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_PRESET_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PRESET_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPreset>>
) => {
  client.setQueryData(PRESET_QUERY_KEY(...keyParams), response);
};

interface GetPresetParams extends SingleQueryParams {
  presetId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetPreset = async ({
  presetId,
  adminApiParams,
}: GetPresetParams): Promise<ConnectedXMResponse<MeetingPreset>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/v2/presets/${presetId}`);

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetPreset = (
  presetId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetPreset>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetPreset>>(
    PRESET_QUERY_KEY(presetId),
    (params) => GetPreset({ presetId, ...params }),
    {
      ...options,
      enabled: !!presetId && (options?.enabled ?? true),
    }
  );
};
