import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPage } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPageCreateInputs } from "@src/params";
import { EVENT_PAGES_QUERY_KEY, SET_EVENT_PAGE_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to create a new event page within a specified event.
 * This function allows users to create a new page for an event by providing the necessary inputs.
 * It is designed to be used in applications where event management and page creation are required.
 * @name CreateEventPage
 * @param {string} eventId (path) - The id of the event
 * @param {EventPageCreateInputs} page (body) - The inputs for creating the event page
 * @version 1.3
 **/
export interface CreateEventPageParams extends MutationParams {
  eventId: string;
  page: EventPageCreateInputs;
}

export const CreateEventPage = async ({
  eventId,
  page,
  adminApiParams,
  queryClient,
}: CreateEventPageParams): Promise<ConnectedXMResponse<EventPage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventPage>>(
    `/events/${eventId}/pages`,
    page
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: EVENT_PAGES_QUERY_KEY(eventId) });
    SET_EVENT_PAGE_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
}

export const useCreateEventPage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPage>>,
      Omit<CreateEventPageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPageParams,
    Awaited<ReturnType<typeof CreateEventPage>>
  >(CreateEventPage, options, {
    domain: "events",
    type: "update",
  });
};