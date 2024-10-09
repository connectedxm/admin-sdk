import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationBypass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRegistrationBypassCreateInputs } from "@src/params";
import {
  EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY,
  SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Bypass
 */
export interface CreateEventRegistrationBypassParams extends MutationParams {
  eventId: string;
  bypass: EventRegistrationBypassCreateInputs;
}

/**
 * @category Methods
 * @group Event-Bypass
 */
export const CreateEventRegistrationBypass = async ({
  eventId,
  bypass,
  adminApiParams,
  queryClient,
}: CreateEventRegistrationBypassParams): Promise<
  ConnectedXMResponse<RegistrationBypass>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<RegistrationBypass>
  >(`/events/${eventId}/bypass`, bypass);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId),
    });
    SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA(
      queryClient,
      [eventId, eventId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Bypass
 */
export const useCreateEventRegistrationBypass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventRegistrationBypass>>,
      Omit<
        CreateEventRegistrationBypassParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventRegistrationBypassParams,
    Awaited<ReturnType<typeof CreateEventRegistrationBypass>>
  >(CreateEventRegistrationBypass, options, {
    domain: "events",
    type: "update",
  });
};
