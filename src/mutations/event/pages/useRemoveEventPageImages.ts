import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPage } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PAGE_IMAGES_QUERY_KEY,
  SET_EVENT_PAGE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Page
 */
export interface RemoveEventPageImageParams extends MutationParams {
  eventId: string;
  pageId: string;
  imageId: string;
}

/**
 * @category Methods
 * @group Event-Page
 */
export const RemoveEventPageImage = async ({
  eventId,
  pageId,
  imageId,
  adminApiParams,
  queryClient,
}: RemoveEventPageImageParams): Promise<ConnectedXMResponse<EventPage>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventPage>>(
    `/events/${eventId}/pages/${pageId}/images/${imageId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PAGE_IMAGES_QUERY_KEY(eventId, pageId),
    });
    SET_EVENT_PAGE_QUERY_DATA(queryClient, [eventId, pageId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Page
 */
export const useRemoveEventPageImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventPageImage>>,
      Omit<RemoveEventPageImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventPageImageParams,
    Awaited<ReturnType<typeof RemoveEventPageImage>>
  >(RemoveEventPageImage, options, {
    domain: "events",
    type: "update",
  });
};
