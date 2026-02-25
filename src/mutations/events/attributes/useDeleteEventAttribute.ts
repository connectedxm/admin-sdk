import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTRIBUTES_QUERY_KEY,
  EVENT_ATTRIBUTE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attributes
 */
export interface DeleteEventAttributeParams extends MutationParams {
  eventId: string;
  attributeId: string;
}

/**
 * @category Methods
 * @group Event-Attributes
 */
export const DeleteEventAttribute = async ({
  eventId,
  attributeId,
  adminApiParams,
  queryClient,
}: DeleteEventAttributeParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/attributes/${attributeId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTRIBUTES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_ATTRIBUTE_QUERY_KEY(eventId, attributeId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attributes
 */
export const useDeleteEventAttribute = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventAttribute>>,
      Omit<DeleteEventAttributeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventAttributeParams,
    Awaited<ReturnType<typeof DeleteEventAttribute>>
  >(DeleteEventAttribute, options);
};
