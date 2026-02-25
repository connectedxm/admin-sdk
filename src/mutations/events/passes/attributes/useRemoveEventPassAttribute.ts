import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, PassAttribute } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PASS_ATTRIBUTES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface RemoveEventPassAttributeParams extends MutationParams {
  eventId: string;
  passId: string;
  attributeId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const RemoveEventPassAttribute = async ({
  eventId,
  passId,
  attributeId,
  adminApiParams,
  queryClient,
}: RemoveEventPassAttributeParams): Promise<
  ConnectedXMResponse<PassAttribute>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<PassAttribute>
  >(`/events/${eventId}/passes/${passId}/attributes/${attributeId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_ATTRIBUTES_QUERY_KEY(eventId, passId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useRemoveEventPassAttribute = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventPassAttribute>>,
      Omit<RemoveEventPassAttributeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventPassAttributeParams,
    Awaited<ReturnType<typeof RemoveEventPassAttribute>>
  >(RemoveEventPassAttribute, options);
};
