import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PAGES_QUERY_KEY, EVENT_PAGE_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific event page within an event management system.
 * This function allows administrators to remove a page associated with a particular event by providing the event and page identifiers.
 * It ensures that the relevant cache is invalidated and queries are removed to maintain data consistency.
 * @name DeleteEventPage
 * @param {string} eventId (path) The id of the event
 * @param {string} pageId (path) The id of the page
 * @version 1.3
 **/

export interface DeleteEventPageParams extends MutationParams {
  eventId: string;
  pageId: string;
}

export const DeleteEventPage = async ({
  eventId,
  pageId,
  adminApiParams,
  queryClient,
}: DeleteEventPageParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
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
  >(DeleteEventPage, options, {
    domain: "events",
    type: "update",
  });
};
