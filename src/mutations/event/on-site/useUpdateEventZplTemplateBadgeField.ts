import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventOnSiteBadgeField } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventBadgeFieldUpdateInputs } from "@src/params";
import {
  EVENT_ON_SITE_QUERY_KEY,
  EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to update the ZPL template badge field for a specific event.
 * This function allows updating the details of a badge field within a ZPL template for a given event.
 * It is designed to be used in scenarios where modifications to badge fields are required for event management.
 * @name UpdateEventZplTemplateBadgeField
 * @param {string} eventId (path) - The id of the event
 * @param {string} fieldId (path) - The id of the field
 * @param {EventBadgeFieldUpdateInputs} field (body) - The field update inputs
 * @version 1.3
 **/

export interface UpdateEventZplTemplateBadgeFieldParams extends MutationParams {
  eventId: string;
  fieldId: string;
  field: EventBadgeFieldUpdateInputs;
}

export const UpdateEventZplTemplateBadgeField = async ({
  eventId,
  fieldId,
  field,
  adminApiParams,
  queryClient,
}: UpdateEventZplTemplateBadgeFieldParams): Promise<
  ConnectedXMResponse<EventOnSiteBadgeField>
> => {
  if (!fieldId) throw new Error("Field ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/events/${eventId}/zpl-template/fields/${fieldId}`,
    {
      ...field,
      id: undefined,
      eventId: undefined,
      name: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      onSite: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ZPL_TEMPLATE_BADGE_FIELDS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ON_SITE_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useUpdateEventZplTemplateBadgeField = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventZplTemplateBadgeField>>,
      Omit<
        UpdateEventZplTemplateBadgeFieldParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventZplTemplateBadgeFieldParams,
    Awaited<ReturnType<typeof UpdateEventZplTemplateBadgeField>>
  >(UpdateEventZplTemplateBadgeField, options, {
    domain: "events",
    type: "update",
  });
};