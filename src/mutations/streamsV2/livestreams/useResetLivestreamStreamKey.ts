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
export interface ResetLivestreamStreamKeyParams extends MutationParams {
  livestreamId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const ResetLivestreamStreamKey = async ({
  livestreamId,
  adminApiParams,
  queryClient,
}: ResetLivestreamStreamKeyParams): Promise<ConnectedXMResponse<Livestream>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Livestream>>(
    `/streams/v2/livestreams/${livestreamId}/reset-stream-key`
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
export const useResetLivestreamStreamKey = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ResetLivestreamStreamKey>>,
      Omit<ResetLivestreamStreamKeyParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ResetLivestreamStreamKeyParams,
    Awaited<ReturnType<typeof ResetLivestreamStreamKey>>
  >(ResetLivestreamStreamKey, options);
};

