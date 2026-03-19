import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PASSES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface UpdateEventPassesReadyParams extends MutationParams {
  eventId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const UpdateEventPassesReady = async ({
  eventId,
  adminApiParams,
  queryClient,
}: UpdateEventPassesReadyParams): Promise<ConnectedXMResponse<EventPass[]>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventPass[]>>(
    `/events/${eventId}/passes/ready`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASSES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASSES_QUERY_KEY(eventId, true),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useUpdateEventPassesReady = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassesReady>>,
      Omit<UpdateEventPassesReadyParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassesReadyParams,
    Awaited<ReturnType<typeof UpdateEventPassesReady>>
  >(UpdateEventPassesReady, options);
};
