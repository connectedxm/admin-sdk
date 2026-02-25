import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAttribute } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAttributeCreateInputs } from "@src/params";
import {
  EVENT_ATTRIBUTES_QUERY_KEY,
  SET_EVENT_ATTRIBUTE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attributes
 */
export interface CreateEventAttributeParams extends MutationParams {
  eventId: string;
  attribute: EventAttributeCreateInputs;
}

/**
 * @category Methods
 * @group Event-Attributes
 */
export const CreateEventAttribute = async ({
  eventId,
  attribute,
  adminApiParams,
  queryClient,
}: CreateEventAttributeParams): Promise<
  ConnectedXMResponse<EventAttribute>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventAttribute>
  >(`/events/${eventId}/attributes`, attribute);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTRIBUTES_QUERY_KEY(eventId),
    });
    SET_EVENT_ATTRIBUTE_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attributes
 */
export const useCreateEventAttribute = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventAttribute>>,
      Omit<CreateEventAttributeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventAttributeParams,
    Awaited<ReturnType<typeof CreateEventAttribute>>
  >(CreateEventAttribute, options);
};
