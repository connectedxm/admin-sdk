import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPage } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPageUpdateInputs } from "@src/params";
import { EVENT_PAGES_QUERY_KEY, SET_EVENT_PAGE_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to update an event page with new details.
 * This function allows updating the details of a specific event page by providing the event ID, page ID, and the new page details.
 * It is designed to be used in applications where event page information needs to be modified.
 * @name UpdateEventPage
 * @param {string} eventId (path) The id of the event
 * @param {string} pageId (path) The id of the page
 * @param {EventPageUpdateInputs} page (body) The details of the event page to update
 * @version 1.3
 **/

export interface UpdateEventPageParams extends MutationParams {
  eventId: string;
  pageId: string;
  page: EventPageUpdateInputs;
}

export const UpdateEventPage = async ({
  eventId,
  pageId,
  page,
  adminApiParams,
  queryClient,
}: UpdateEventPageParams): Promise<ConnectedXMResponse<EventPage>> => {
  if (!pageId) throw new Error("Page ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(`/events/${eventId}/pages/${pageId}`, {
    ...page,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: EVENT_PAGES_QUERY_KEY(eventId) });
    SET_EVENT_PAGE_QUERY_DATA(
      queryClient,
      [eventId, pageId || data.data?.id],
      data
    );
  }
  return data;
};

export const useUpdateEventPage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPage>>,
      Omit<UpdateEventPageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPageParams,
    Awaited<ReturnType<typeof UpdateEventPage>>
  >(UpdateEventPage, options, {
    domain: "events",
    type: "update",
  });
};
