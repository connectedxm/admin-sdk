import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FOLLOWUP_PASS_TYPES_QUERY_KEY,
  SET_EVENT_FOLLOWUP_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Followups
 */
export interface RemoveEventFollowupPassTypeParams extends MutationParams {
  eventId: string;
  followupId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Event-Followups
 */
export const RemoveEventFollowupPassType = async ({
  eventId,
  followupId,
  passTypeId,
  adminApiParams,
  queryClient,
}: RemoveEventFollowupPassTypeParams): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<RegistrationFollowup>
  >(`/events/${eventId}/followups/${followupId}/passTypes/${passTypeId}`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FOLLOWUP_PASS_TYPES_QUERY_KEY(eventId, followupId),
    });
    SET_EVENT_FOLLOWUP_QUERY_DATA(queryClient, [eventId, followupId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Followups
 */
export const useRemoveEventFollowupPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventFollowupPassType>>,
      Omit<RemoveEventFollowupPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventFollowupPassTypeParams,
    Awaited<ReturnType<typeof RemoveEventFollowupPassType>>
  >(RemoveEventFollowupPassType, options, {
    domain: "events",
    type: "update",
  });
};
