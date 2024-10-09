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
 * @category Params
 * @group Event-Page
 */
export interface CreateEventPageParams extends MutationParams {
  eventId: string;
  page: EventPageCreateInputs;
}

/**
 * @category Methods
 * @group Event-Page
 */
export const CreateEventPage = async ({
  eventId,
  page,
  adminApiParams,
  queryClient,
}: CreateEventPageParams): Promise<ConnectedXMResponse<EventPage>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventPage>>(
    `/events/${eventId}/pages`,
    page
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: EVENT_PAGES_QUERY_KEY(eventId) });
    SET_EVENT_PAGE_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Page
 */
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
