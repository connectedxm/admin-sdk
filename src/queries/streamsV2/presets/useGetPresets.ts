import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, MeetingPreset } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const PRESETS_QUERY_KEY = () => {
  return ["STREAMS_V2", "PRESETS"];
};

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_PRESETS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PRESETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPresets>>
) => {
  client.setQueryData(PRESETS_QUERY_KEY(...keyParams), response);
};

interface GetPresetsParams extends SingleQueryParams {}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetPresets = async ({
  adminApiParams,
}: GetPresetsParams): Promise<ConnectedXMResponse<MeetingPreset[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/v2/presets`);

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetPresets = (
  options: SingleQueryOptions<ReturnType<typeof GetPresets>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetPresets>>(
    PRESETS_QUERY_KEY(),
    (params) => GetPresets(params),
    options
  );
};
