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
 * @category Params
 * @group Event-OnSite
 */
export interface UpdateEventZplTemplateParams extends MutationParams {
  eventId: string;
  zplTemplate: string;
}

/**
 * @category Methods
 * @group Event-OnSite
 */
export const UpdateEventZplTemplate = async ({
  eventId,
  zplTemplate,
  adminApiParams,
  queryClient,
}: UpdateEventZplTemplateParams): Promise<ConnectedXMResponse<EventOnSite>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(`/events/${eventId}/zpl-template`, {
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

/**
 * @category Mutations
 * @group Event-OnSite
 */
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
  >(UpdateEventZplTemplate, options);
};
