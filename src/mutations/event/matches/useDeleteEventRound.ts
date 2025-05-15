import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_ROUNDS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface DeleteEventRoundParams extends MutationParams {
  eventId: string;
  roundId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const DeleteEventRound = async ({
  eventId,
  roundId,
  adminApiParams,
  queryClient,
}: DeleteEventRoundParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/rounds/${roundId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: EVENT_ROUNDS_QUERY_KEY(eventId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useDeleteEventRound = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventRound>>,
      Omit<DeleteEventRoundParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventRoundParams,
    Awaited<ReturnType<typeof DeleteEventRound>>
  >(DeleteEventRound, options, {
    domain: "events",
    type: "del",
  });
};
