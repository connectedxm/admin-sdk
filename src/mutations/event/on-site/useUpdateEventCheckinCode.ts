import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventOnSite } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_ON_SITE_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to update the check-in code for a specific event.
 * This function allows updating the check-in code for an event by providing the event ID.
 * It is used to manage event check-in processes and ensure the correct code is set for on-site operations.
 * @name UpdateEventCheckinCode
 * @param {string} eventId (path) - The id of the event
 * @version 1.3
 **/
export interface UpdateEventCheckinCodeParams extends MutationParams {
  eventId: string;
}

export const UpdateEventCheckinCode = async ({
  eventId,
  adminApiParams,
  queryClient,
}: UpdateEventCheckinCodeParams): Promise<ConnectedXMResponse<EventOnSite>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventOnSite>>(
    `/events/${eventId}/on-site`
  );
  if (queryClient && data.status === "ok") {
    SET_EVENT_ON_SITE_QUERY_DATA(queryClient, [eventId], data);
  }
  return data;
};

export const useUpdateEventCheckinCode = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventCheckinCode>>,
      Omit<UpdateEventCheckinCodeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventCheckinCodeParams,
    Awaited<ReturnType<typeof UpdateEventCheckinCode>>
  >(UpdateEventCheckinCode, options, {
    domain: "events",
    type: "update",
  });
};