import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventOnSite } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY,
  SET_EVENT_ON_SITE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update the ZPL template for a specific event.
 * This function allows updating the ZPL template associated with a given event ID.
 * It is designed to be used in applications where event-specific ZPL templates need to be managed.
 * @name UpdateEventZplTemplate
 * @param {string} eventId (path) - The id of the event
 * @param {string} zplTemplate (bodyValue) - The ZPL template to be updated
 * @version 1.3
 **/
export interface UpdateEventZplTemplateParams extends MutationParams {
  eventId: string;
  zplTemplate: string;
}

export const UpdateEventZplTemplate = async ({
  eventId,
  zplTemplate,
  adminApiParams,
  queryClient,
}: UpdateEventZplTemplateParams): Promise<ConnectedXMResponse<EventOnSite>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(`/events/${eventId}/zpl-template`, {
    zplTemplate,
  });

  if (queryClient && data.status === "ok") {
    SET_EVENT_ON_SITE_QUERY_DATA(queryClient, [eventId], data);
    queryClient.invalidateQueries({
      queryKey: EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useUpdateEventZplTemplate = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventZplTemplate>>,
      Omit<UpdateEventZplTemplateParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventZplTemplateParams,
    Awaited<ReturnType<typeof UpdateEventZplTemplate>>
  >(UpdateEventZplTemplate, options, {
    domain: "events",
    type: "update",
  });
};