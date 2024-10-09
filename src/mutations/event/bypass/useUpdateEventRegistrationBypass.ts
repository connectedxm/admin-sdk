import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationBypass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRegistrationBypassUpdateInputs } from "@src/params";
import {
  EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY,
  SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Bypass
 */
export interface UpdateEventRegistrationBypassParams extends MutationParams {
  eventId: string;
  bypassId: string;
  page: EventRegistrationBypassUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Bypass
 */
export const UpdateEventRegistrationBypass = async ({
  eventId,
  bypassId,
  page,
  adminApiParams,
  queryClient,
}: UpdateEventRegistrationBypassParams): Promise<
  ConnectedXMResponse<RegistrationBypass>
> => {
  if (!bypassId) throw new Error("Page ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<RegistrationBypass>
  >(`/events/${eventId}/bypass/${bypassId}`, {
    ...page,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId),
    });
    SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA(
      queryClient,
      [eventId, bypassId || data.data?.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Bypass
 */
export const useUpdateEventRegistrationBypass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRegistrationBypass>>,
      Omit<
        UpdateEventRegistrationBypassParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRegistrationBypassParams,
    Awaited<ReturnType<typeof UpdateEventRegistrationBypass>>
  >(UpdateEventRegistrationBypass, options, {
    domain: "events",
    type: "update",
  });
};
