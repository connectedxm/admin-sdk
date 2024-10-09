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
 * @category Params
 * @group Event-OnSite
 */
export interface UpdateEventZplTemplateBadgeFieldParams extends MutationParams {
  eventId: string;
  fieldId: string;
  field: EventBadgeFieldUpdateInputs;
}

/**
 * @category Methods
 * @group Event-OnSite
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
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

/**
 * @category Mutations
 * @group Event-OnSite
 */
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
