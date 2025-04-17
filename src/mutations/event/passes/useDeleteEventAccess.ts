import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_ACCESS_QUERY_KEY } from "@src/queries";
import { EVENT_PASS_ACCESSES_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassAccesses";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface DeleteEventAccessParams extends MutationParams {
  eventId: string;
  passId: string;
  accessId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const DeleteEventAccess = async ({
  eventId,
  passId,
  accessId,
  adminApiParams,
  queryClient,
}: DeleteEventAccessParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/accesses/${accessId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_ACCESSES_QUERY_KEY(eventId, passId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_ACCESS_QUERY_KEY(eventId, accessId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useDeleteEventAccess = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventAccess>>,
      Omit<DeleteEventAccessParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventAccessParams,
    Awaited<ReturnType<typeof DeleteEventAccess>>
  >(DeleteEventAccess, options, {
    domain: "events",
    type: "update",
  });
};
