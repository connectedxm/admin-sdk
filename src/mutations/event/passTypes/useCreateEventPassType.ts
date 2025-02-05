import { GetAdminAPI } from "@src/AdminAPI";
import { EventPassType, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { PassTypeCreateInputs } from "@src/params";
import {
  EVENT_PASS_TYPES_QUERY_KEY,
  SET_EVENT_PASS_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a new event pass type for a specified event.
 * This function allows the creation of a new pass type associated with an event, 
 * enabling the management of different pass types within the event's context.
 * It is designed to be used in applications where event pass types need to be dynamically created.
 * @name CreateEventPassType
 * @param {string} eventId - The id of the event
 * @param {PassTypeCreateInputs} passType - The pass type details
 * @version 1.2
**/

export interface CreateEventPassTypeParams extends MutationParams {
  eventId: string;
  passType: PassTypeCreateInputs;
}

export const CreateEventPassType = async ({
  eventId,
  passType,
  adminApiParams,
  queryClient,
}: CreateEventPassTypeParams): Promise<ConnectedXMResponse<EventPassType>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventPassType>>(
    `/events/${eventId}/passTypes`,
    passType
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPES_QUERY_KEY(eventId),
    });
    SET_EVENT_PASS_TYPE_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
}

export const useCreateEventPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPassType>>,
      Omit<CreateEventPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPassTypeParams,
    Awaited<ReturnType<typeof CreateEventPassType>>
  >(CreateEventPassType, options, {
    domain: "events",
    type: "update",
  });
};