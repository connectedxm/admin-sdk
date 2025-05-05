import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_ACCESS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionAccessResponsesParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  passId: string;
  responses: { questionId: string; value: string }[];
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionAccessResponses = async ({
  eventId,
  sessionId,
  passId,
  responses,
  adminApiParams,
  queryClient,
}: UpdateEventSessionAccessResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/passes/${passId}/responses`,
    responses
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ACCESS_QUERY_KEY(eventId, sessionId, passId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionAccessResponses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionAccessResponses>>,
      Omit<
        UpdateEventSessionAccessResponsesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionAccessResponsesParams,
    Awaited<ReturnType<typeof UpdateEventSessionAccessResponses>>
  >(UpdateEventSessionAccessResponses, options, {
    domain: "events",
    type: "update",
  });
};
