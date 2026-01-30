import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse, Round } from "@src/interfaces";
import { EVENT_SESSION_ROUNDS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface CreateEventSessionRoundParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const CreateEventSessionRound = async ({
  eventId,
  sessionId,
  adminApiParams,
  queryClient,
}: CreateEventSessionRoundParams): Promise<ConnectedXMResponse<Round>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Round>>(
    `/events/${eventId}/sessions/${sessionId}/rounds`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ROUNDS_QUERY_KEY(eventId, sessionId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useCreateEventSessionRound = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionRound>>,
      Omit<CreateEventSessionRoundParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionRoundParams,
    Awaited<ReturnType<typeof CreateEventSessionRound>>
  >(CreateEventSessionRound, options);
};
