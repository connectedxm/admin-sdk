import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BOOKING_SPACE_QUESTIONS_QUERY_KEY,
  BOOKING_SPACE_QUESTION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DeleteBookingSpaceQuestionParams extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DeleteBookingSpaceQuestion = async ({
  placeId,
  spaceId,
  questionId,
  adminApiParams,
  queryClient,
}: DeleteBookingSpaceQuestionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTIONS_QUERY_KEY(placeId, spaceId),
    });
    queryClient.removeQueries({
      queryKey: BOOKING_SPACE_QUESTION_QUERY_KEY(placeId, spaceId, questionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDeleteBookingSpaceQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBookingSpaceQuestion>>,
      Omit<DeleteBookingSpaceQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(DeleteBookingSpaceQuestion, options);
};
