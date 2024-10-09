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
 * @category Params
 * @group Event-Page
 */
export interface UpdateEventPageParams extends MutationParams {
  eventId: string;
  pageId: string;
  page: EventPageUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Page
 */
export const UpdateEventPage = async ({
  eventId,
  pageId,
  page,
  adminApiParams,
  queryClient,
}: UpdateEventPageParams): Promise<ConnectedXMResponse<EventPage>> => {
  if (!pageId) throw new Error("Page ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(`/events/${eventId}/pages/${pageId}`, {
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

/**
 * @category Mutations
 * @group Event-Page
 */
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
