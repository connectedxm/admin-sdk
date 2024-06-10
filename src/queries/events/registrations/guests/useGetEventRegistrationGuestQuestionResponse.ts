// import { ConnectedXMResponse } from "@src/interfaces";
// import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
// import { RegistrationQuestionWithResponse } from "../useGetEventRegistrationQuestionResponses";
// import { EVENT_REGISTRATION_GUEST_QUESTION_RESPONSES_QUERY_KEY } from "./useGetEventRegistrationGuestQuestionResponses";

// export const EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_QUERY_KEY = (
//   eventId: string,
//   registrationId: string,
//   guestId: string,
//   questionId: string
// ) => [
//   ...EVENT_REGISTRATION_GUEST_QUESTION_RESPONSES_QUERY_KEY(
//     eventId,
//     registrationId,
//     guestId
//   ),
//   questionId,
// ];

// export const SET_EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_QUERY_DATA = (
//   client: any,
//   keyParams: Parameters<
//     typeof EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_QUERY_KEY
//   >,
//   response: Awaited<
//     ReturnType<typeof GetEventRegistrationGuestQuestionResponse>
//   >
// ) => {
//   client.setQueryData(
//     EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_QUERY_KEY(...keyParams),
//     response
//   );
// };

// interface GetEventRegistrationGuestQuestionResponseProps {
//   eventId: string;
//   registrationId: string;
//   questionId: string;
//   guestId: string;
// }

// export const GetEventRegistrationGuestQuestionResponse = async ({
//   eventId,
//   registrationId,
//   questionId,
//   guestId,
// }: GetEventRegistrationGuestQuestionResponseProps): Promise<
//   ConnectedXMResponse<RegistrationQuestionWithResponse>
// > => {
//   const adminApi = await GetAdminAPI(adminApiParams);
//   const { data } = await adminApi.get(
//     `/events/${eventId}/registrations/${registrationId}/guests/${guestId}/questions/${questionId}`
//   );
//   return data;
// };

// const useGetEventRegistrationGuestQuestionResponse = (
//   eventId: string,
//   registrationId: string = "",
//   guestId: string,
//   questionId: string
// ) => {
//   return useConnectedSingleQuery<
//     Awaited<ReturnType<typeof GetEventRegistrationGuestQuestionResponse>>
//   >(
//     EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_QUERY_KEY(
//       eventId,
//       registrationId,
//       guestId,
//       questionId
//     ),
//     () =>
//       GetEventRegistrationGuestQuestionResponse({
//         eventId,
//         registrationId,
//         questionId,
//         guestId,
//       }),
//     {
//       enabled: !!eventId && !!registrationId && !!questionId && !!guestId,
//     }
//   );
// };

// export default useGetEventRegistrationGuestQuestionResponse;
