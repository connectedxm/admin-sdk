import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionPass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_PASS_RESPONSES_QUERY_KEY } from "@src/queries/events/passes/useGetEventSessionPassResponses";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface UpdateEventSessionPassResponsesParams extends MutationParams {
  eventId: string;
  sessionPassId: string;
  responses: { questionId: string; value: string }[];
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const UpdateEventSessionPassResponses = async ({
  eventId,
  sessionPassId,
  responses,
  adminApiParams,
  queryClient,
}: UpdateEventSessionPassResponsesParams): Promise<
  ConnectedXMResponse<EventSessionPass>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventSessionPass>>(
    `/events/${eventId}/sessionPasses/${sessionPassId}`,
    responses
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_PASS_RESPONSES_QUERY_KEY(eventId, sessionPassId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useUpdateEventSessionPassResponses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionPassResponses>>,
      Omit<
        UpdateEventSessionPassResponsesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionPassResponsesParams,
    Awaited<ReturnType<typeof UpdateEventSessionPassResponses>>
  >(UpdateEventSessionPassResponses, options, {
    domain: "events",
    type: "update",
  });
};
