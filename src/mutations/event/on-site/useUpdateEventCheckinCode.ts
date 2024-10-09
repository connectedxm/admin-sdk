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
export interface UpdateEventCheckinCodeParams extends MutationParams {
  eventId: string;
}

/**
 * @category Methods
 * @group Event-OnSite
 */
export const UpdateEventCheckinCode = async ({
  eventId,
  adminApiParams,
  queryClient,
}: UpdateEventCheckinCodeParams): Promise<ConnectedXMResponse<EventOnSite>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventOnSite>>(
    `/events/${eventId}/on-site`
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
