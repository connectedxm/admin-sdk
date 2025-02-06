import { GetAdminAPI } from "@src/AdminAPI";
import { EventPassType, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { PassTypeUpdateInputs } from "@src/params";
import {
  EVENT_PASS_TYPES_QUERY_KEY,
  SET_EVENT_PASS_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update an event pass type with new data.
 * This function allows updating the details of a specific event pass type by providing the event ID and pass type ID.
 * It is used to modify existing pass types within an event, ensuring the pass type data is current and accurate.
 * @name UpdateEventPassType
 * @param {string} eventId (path) - The id of the event
 * @param {string} passTypeId (path) - The id of the pass type
 * @param {PassTypeUpdateInputs} passType (body) - The new data for the pass type
 * @version 1.3
 **/

export interface UpdateEventPassTypeParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  passType: PassTypeUpdateInputs;
}

export const UpdateEventPassType = async ({
  eventId,
  passTypeId,
  passType,
  adminApiParams,
  queryClient,
}: UpdateEventPassTypeParams): Promise<ConnectedXMResponse<EventPassType>> => {
  if (!passTypeId) throw new Error("PassType ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventPassType>>(
    `/events/${eventId}/passTypes/${passTypeId}`,
    {
      ...passType,
      id: undefined,
      featuredImage: undefined,
      allowedTiers: undefined,
      event: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPES_QUERY_KEY(eventId),
    });
    SET_EVENT_PASS_TYPE_QUERY_DATA(
      queryClient,
      [eventId, passTypeId || data.data?.id],
      data
    );
  }
  return data;
}

export const useUpdateEventPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassType>>,
      Omit<UpdateEventPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassTypeParams,
    Awaited<ReturnType<typeof UpdateEventPassType>>
  >(UpdateEventPassType, options, {
    domain: "events",
    type: "update",
  });
};