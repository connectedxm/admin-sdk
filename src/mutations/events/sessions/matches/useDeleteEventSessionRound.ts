import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_SESSION_ROUNDS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface DeleteEventSessionRoundParams extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const DeleteEventSessionRound = async ({
  eventId,
  sessionId,
  roundId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionRoundParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_ROUNDS_QUERY_KEY(eventId, sessionId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useDeleteEventSessionRound = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionRound>>,
      Omit<DeleteEventSessionRoundParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionRoundParams,
    Awaited<ReturnType<typeof DeleteEventSessionRound>>
  >(DeleteEventSessionRound, options);
};
