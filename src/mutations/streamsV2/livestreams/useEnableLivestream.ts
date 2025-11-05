import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, Livestream } from "@src/interfaces";
import {
  LIVESTREAMS_QUERY_KEY,
  SET_LIVESTREAM_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group StreamsV2
 */
export interface EnableLivestreamParams extends MutationParams {
  livestreamId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const EnableLivestream = async ({
  livestreamId,
  adminApiParams,
  queryClient,
}: EnableLivestreamParams): Promise<ConnectedXMResponse<Livestream>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Livestream>>(
    `/streams/v2/livestreams/${livestreamId}/enable`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: LIVESTREAMS_QUERY_KEY() });
    SET_LIVESTREAM_QUERY_DATA(queryClient, [livestreamId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useEnableLivestream = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof EnableLivestream>>,
      Omit<EnableLivestreamParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    EnableLivestreamParams,
    Awaited<ReturnType<typeof EnableLivestream>>
  >(EnableLivestream, options);
};

