import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAccess } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAccessCreateInputs } from "@src/params";
import { SET_EVENT_ACCESS_QUERY_DATA } from "@src/queries/events/passes/useGetEventAccess";
import { EVENT_PASS_ACCESSES_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassAccesses";
import { EVENT_ACCESSES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Attendees-Passs
 */
export interface CreateEventAccessParams extends MutationParams {
  eventId: string;
  passId: string;
  access: EventAccessCreateInputs;
}

/**
 * @category Methods
 * @group Event-Attendees-Passs
 */
export const CreateEventAccess = async ({
  eventId,
  passId,
  access,
  adminApiParams,
  queryClient,
}: CreateEventAccessParams): Promise<ConnectedXMResponse<EventAccess>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventAccess>>(
    `/events/${eventId}/passes/${passId}/accesses`,
    access
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_ACCESSES_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ACCESSES_QUERY_KEY(eventId, data.data.session.id),
    });
    SET_EVENT_ACCESS_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendees-Passs
 */
export const useCreateEventAccess = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventAccess>>,
      Omit<CreateEventAccessParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventAccessParams,
    Awaited<ReturnType<typeof CreateEventAccess>>
  >(CreateEventAccess, options, {
    domain: "events",
    type: "update",
  });
};
