import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PAGES_QUERY_KEY, EVENT_PAGE_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Page
 */
export interface DeleteEventPageParams extends MutationParams {
  eventId: string;
  pageId: string;
}

/**
 * @category Methods
 * @group Event-Page
 */
export const DeleteEventPage = async ({
  eventId,
  pageId,
  adminApiParams,
  queryClient,
}: DeleteEventPageParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/pages/${pageId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: EVENT_PAGES_QUERY_KEY(eventId) });
    queryClient.removeQueries({
      queryKey: EVENT_PAGE_QUERY_KEY(eventId, pageId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Page
 */
export const useDeleteEventPage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventPage>>,
      Omit<DeleteEventPageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventPageParams,
    Awaited<ReturnType<typeof DeleteEventPage>>
  >(DeleteEventPage, options);
};
