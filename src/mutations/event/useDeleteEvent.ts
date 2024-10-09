import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENTS_QUERY_KEY, EVENT_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface DeleteEventParams extends MutationParams {
  eventId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const DeleteEvent = async ({
  eventId,
  adminApiParams,
  queryClient,
}: DeleteEventParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: EVENT_QUERY_KEY(eventId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useDeleteEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEvent>>,
      Omit<DeleteEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventParams,
    Awaited<ReturnType<typeof DeleteEvent>>
  >(DeleteEvent, options, {
    domain: "events",
    type: "del",
  });
};
