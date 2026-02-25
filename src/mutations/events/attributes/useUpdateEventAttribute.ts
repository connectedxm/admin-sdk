import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAttribute } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAttributeUpdateInputs } from "@src/params";
import {
  EVENT_ATTRIBUTES_QUERY_KEY,
  SET_EVENT_ATTRIBUTE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attributes
 */
export interface UpdateEventAttributeParams extends MutationParams {
  eventId: string;
  attributeId: string;
  attribute: EventAttributeUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Attributes
 */
export const UpdateEventAttribute = async ({
  eventId,
  attributeId,
  attribute,
  adminApiParams,
  queryClient,
}: UpdateEventAttributeParams): Promise<
  ConnectedXMResponse<EventAttribute>
> => {
  if (!attributeId) throw new Error("Attribute ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventAttribute>
  >(`/events/${eventId}/attributes/${attributeId}`, attribute);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTRIBUTES_QUERY_KEY(eventId),
    });
    SET_EVENT_ATTRIBUTE_QUERY_DATA(
      queryClient,
      [eventId, attributeId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attributes
 */
export const useUpdateEventAttribute = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventAttribute>>,
      Omit<UpdateEventAttributeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAttributeParams,
    Awaited<ReturnType<typeof UpdateEventAttribute>>
  >(UpdateEventAttribute, options);
};
