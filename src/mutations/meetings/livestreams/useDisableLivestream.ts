import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, Livestream } from "@src/interfaces";
import { LIVESTREAMS_QUERY_KEY, SET_LIVESTREAM_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group StreamsV2
 */
export interface DisableLivestreamParams extends MutationParams {
  livestreamId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const DisableLivestream = async ({
  livestreamId,
  adminApiParams,
  queryClient,
}: DisableLivestreamParams): Promise<ConnectedXMResponse<Livestream>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Livestream>>(
    `/meetings/livestreams/${livestreamId}/disable`
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
export const useDisableLivestream = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DisableLivestream>>,
      Omit<DisableLivestreamParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DisableLivestreamParams,
    Awaited<ReturnType<typeof DisableLivestream>>
  >(DisableLivestream, options);
};
