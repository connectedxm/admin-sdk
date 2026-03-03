import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventOnSite } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_ON_SITE_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Event-OnSite
 */
export interface UpdateEventBadgeTemplateParams extends MutationParams {
  eventId: string;
  badgeTemplate: object;
}

/**
 * @category Methods
 * @group Event-OnSite
 */
export const UpdateEventBadgeTemplate = async ({
  eventId,
  badgeTemplate,
  adminApiParams,
  queryClient,
}: UpdateEventBadgeTemplateParams): Promise<
  ConnectedXMResponse<EventOnSite>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/template`,
    badgeTemplate
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_ON_SITE_QUERY_DATA(queryClient, [eventId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-OnSite
 */
export const useUpdateEventBadgeTemplate = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventBadgeTemplate>>,
      Omit<UpdateEventBadgeTemplateParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventBadgeTemplateParams,
    Awaited<ReturnType<typeof UpdateEventBadgeTemplate>>
  >(UpdateEventBadgeTemplate, options);
};
