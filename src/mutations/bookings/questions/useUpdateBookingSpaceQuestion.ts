import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, BookingSpaceQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BookingSpaceQuestionUpdateInputs } from "@src/params";
import {
  BOOKING_SPACE_QUESTIONS_QUERY_KEY,
  SET_BOOKING_SPACE_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface UpdateBookingSpaceQuestionParams extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  question: BookingSpaceQuestionUpdateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const UpdateBookingSpaceQuestion = async ({
  placeId,
  spaceId,
  questionId,
  question,
  adminApiParams,
  queryClient,
}: UpdateBookingSpaceQuestionParams): Promise<
  ConnectedXMResponse<BookingSpaceQuestion>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<BookingSpaceQuestion>
  >(`/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}`, {
    ...question,
    id: undefined,
    choices: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTIONS_QUERY_KEY(placeId, spaceId),
    });
    SET_BOOKING_SPACE_QUESTION_QUERY_DATA(
      queryClient,
      [placeId, spaceId, questionId || data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useUpdateBookingSpaceQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateBookingSpaceQuestion>>,
      Omit<UpdateBookingSpaceQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingSpaceQuestionParams,
    Awaited<ReturnType<typeof UpdateBookingSpaceQuestion>>
  >(UpdateBookingSpaceQuestion, options);
};
