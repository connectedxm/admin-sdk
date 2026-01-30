import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, Round } from "@src/interfaces";
import { EVENT_ROUNDS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface CreateEventRoundParams extends MutationParams {
  eventId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const CreateEventRound = async ({
  eventId,
  adminApiParams,
  queryClient,
}: CreateEventRoundParams): Promise<ConnectedXMResponse<Round>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Round>>(
    `/events/${eventId}/rounds`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROUNDS_QUERY_KEY(eventId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useCreateEventRound = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventRound>>,
      Omit<CreateEventRoundParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventRoundParams,
    Awaited<ReturnType<typeof CreateEventRound>>
  >(CreateEventRound, options);
};
