import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_TYPES_QUERY_KEY,
  EVENT_PASS_TYPE_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a specific event pass type.
 * This function allows the removal of a pass type associated with a particular event by specifying the event and pass type IDs.
 * It is useful in scenarios where event organizers need to manage and update the types of passes available for their events.
 * @name DeleteEventPassType
 * @param {string} eventId - The id of the event
 * @param {string} passTypeId - The id of the pass type
 * @version 1.2
 **/
export interface DeleteEventPassTypeParams extends MutationParams {
  eventId: string;
  passTypeId: string;
}

export const DeleteEventPassType = async ({
  eventId,
  passTypeId,
  adminApiParams,
  queryClient,
}: DeleteEventPassTypeParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/passTypes/${passTypeId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId),
    });
  }
  return data;
};

export const useDeleteEventPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPassType>>,
      Omit<DeleteEventPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPassTypeParams,
    Awaited<ReturnType<typeof DeleteEventPassType>>
  >(DeleteEventPassType, options, {
    domain: "events",
    type: "update",
  });
};