import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAccess } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAccessUpdateInputs } from "@src/params";
import { SET_EVENT_ACCESS_QUERY_DATA } from "@src/queries/events/passes/useGetEventAccess";
import { EVENT_PASS_ACCESSES_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassAccesses";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface UpdateEventAccessParams extends MutationParams {
  eventId: string;
  passId: string;
  accessId: string;
  access: EventAccessUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const UpdateEventAccess = async ({
  eventId,
  passId,
  accessId,
  access,
  adminApiParams,
  queryClient,
}: UpdateEventAccessParams): Promise<ConnectedXMResponse<EventAccess>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventAccess>>(
    `/events/${eventId}/accesses/${accessId}`,
    access
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_ACCESSES_QUERY_KEY(eventId, passId),
    });

    SET_EVENT_ACCESS_QUERY_DATA(queryClient, [eventId, accessId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useUpdateEventAccess = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventAccess>>,
      Omit<UpdateEventAccessParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAccessParams,
    Awaited<ReturnType<typeof UpdateEventAccess>>
  >(UpdateEventAccess, options, {
    domain: "events",
    type: "update",
  });
};
