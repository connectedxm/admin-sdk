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
export interface AddEventPageImageParams extends MutationParams {
  eventId: string;
  pageId: string;
  imageId: string;
}

/**
 * @category Methods
 * @group Event-Page
 */
export const AddEventPageImage = async ({
  eventId,
  pageId,
  imageId,
  adminApiParams,
  queryClient,
}: AddEventPageImageParams): Promise<ConnectedXMResponse<EventPage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(
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
export const useAddEventPageImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventPageImage>>,
      Omit<AddEventPageImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventPageImageParams,
    Awaited<ReturnType<typeof AddEventPageImage>>
  >(AddEventPageImage, options, {
    domain: "events",
    type: "update",
  });
};
