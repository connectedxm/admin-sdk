import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY,
  EVENT_REGISTRATION_BYPASS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Bypass
 */
export interface DeleteEventRegistrationBypassParams extends MutationParams {
  eventId: string;
  bypassId: string;
}

/**
 * @category Methods
 * @group Event-Bypass
 */
export const DeleteEventRegistrationBypass = async ({
  eventId,
  bypassId,
  adminApiParams,
  queryClient,
}: DeleteEventRegistrationBypassParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/bypass/${bypassId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_BYPASS_QUERY_KEY(eventId, bypassId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Bypass
 */
export const useDeleteEventRegistrationBypass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventRegistrationBypass>>,
      Omit<
        DeleteEventRegistrationBypassParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventRegistrationBypassParams,
    Awaited<ReturnType<typeof DeleteEventRegistrationBypass>>
  >(DeleteEventRegistrationBypass, options, {
    domain: "events",
    type: "update",
  });
};
