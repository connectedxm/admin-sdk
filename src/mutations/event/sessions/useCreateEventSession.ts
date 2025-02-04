import { GetAdminAPI } from "@src/AdminAPI";
import { EventSession, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionCreateInputs } from "@src/params";
import {
  EVENT_SESSIONS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface CreateEventSessionParams extends MutationParams {
  eventId: string;
  session: EventSessionCreateInputs;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const CreateEventSession = async ({
  eventId,
  session,
  adminApiParams,
  queryClient,
}: CreateEventSessionParams): Promise<ConnectedXMResponse<EventSession>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions`,
    session
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useCreateEventSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSession>>,
      Omit<CreateEventSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionParams,
    Awaited<ReturnType<typeof CreateEventSession>>
  >(CreateEventSession, options, {
    domain: "events",
    type: "update",
  });
};
