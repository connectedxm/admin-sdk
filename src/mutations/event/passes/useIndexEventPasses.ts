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
export interface IndexEventPassesParams extends MutationParams {
  eventId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const IndexEventPasses = async ({
  eventId,
  adminApiParams,
  queryClient,
}: IndexEventPassesParams): Promise<ConnectedXMResponse<EventPass[]>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.get<ConnectedXMResponse<EventPass[]>>(
    `/events/${eventId}/index-passes`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASSES_QUERY_KEY(eventId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useIndexEventPasses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof IndexEventPasses>>,
      Omit<IndexEventPassesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    IndexEventPassesParams,
    Awaited<ReturnType<typeof IndexEventPasses>>
  >(IndexEventPasses, options);
};

