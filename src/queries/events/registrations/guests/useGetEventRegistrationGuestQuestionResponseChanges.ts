import { GetAdminAPI } from "@src/AdminAPI";
// import { ConnectedXMResponse } from "@src/interfaces";

// import { QueryClient } from "@tanstack/react-query";
// import useConnectedInfiniteQuery, {
//   InfiniteQueryParams,
// } from "@/context/queries/useConnectedInfiniteQuery";
// import { EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_QUERY_KEY } from "./useGetEventRegistrationGuestQuestionResponse";
// import { RegistrationQuestionResponseChange } from "@src/interfaces";

// export const EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_CHANGES_QUERY_KEY = (
//   eventId: string,
//   registrationId: string,
//   guestId: string,
//   questionId: string,
//   responseId: string
// ) => [
//   ...EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_QUERY_KEY(
//     eventId,
//     registrationId,
//     guestId,
//     questionId
//   ),
//   responseId,
//   "CHANGES",
// ];

// export const SET_EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_CHANGES_QUERY_DATA =
//   (
//     client: QueryClient,
//     keyParams: Parameters<
//       typeof EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_CHANGES_QUERY_KEY
//     >,
//     response: Awaited<
//       ReturnType<typeof GetEventRegistrationGuestQuestionResponseChanges>
//     >
//   ) => {
//     client.setQueryData(
//       EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_CHANGES_QUERY_KEY(
//         ...keyParams
//       ),
//       response
//     );
//   };

// interface GetEventRegistrationGuestQuestionResponseChangesProps
//   extends InfiniteQueryParams {
//   eventId: string;
//   registrationId: string;
//   guestId: string;
//   questionId: string;
//   responseId: string;
// }

// export const GetEventRegistrationGuestQuestionResponseChanges = async ({
//   eventId,
//   registrationId,
//   guestId,
//   questionId,
//   responseId,
//   page,
//   pageSize,
//   orderBy,
//   search,
// }: GetEventRegistrationGuestQuestionResponseChangesProps): Promise<
//   ConnectedXMResponse<RegistrationQuestionResponseChange[]>
// > => {
//   const adminApi = await GetAdminAPI(adminApiParams);
//   const { data } = await adminApi.get(
//     `/events/${eventId}/registrations/${registrationId}/guests/${guestId}/questions/${questionId}/responses/${responseId}/changes`,
//     {
//       params: {
//         page: pageParam || undefined,
//         pageSize: pageSize || undefined,
//         orderBy: orderBy || undefined,
//         search: search || undefined,
//       },
//     }
//   );
//   return data;
// };

// const useGetEventRegistrationGuestQuestionResponseChanges = (
//   eventId: string,
//   registrationId: string,
//   guestId: string,
//   questionId: string,
//   responseId: string
// ) => {
//   return useConnectedInfiniteQuery<
//     Awaited<ReturnType<typeof GetEventRegistrationGuestQuestionResponseChanges>>
//   >(
//     EVENT_REGISTRATION_GUEST_QUESTION_RESPONSE_CHANGES_QUERY_KEY(
//       eventId,
//       registrationId,
//       guestId,
//       questionId,
//       responseId
//     ),
//     (params: any) => GetEventRegistrationGuestQuestionResponseChanges(params),
//     {
//       eventId,
//       registrationId,
//       guestId,
//       questionId,
//       responseId,
//     },
//     {
//       enabled:
//         !!eventId &&
//         !!registrationId &&
//         !!guestId &&
//         !!questionId &&
//         !!responseId,
//     }
//   );
// };

// export default useGetEventRegistrationGuestQuestionResponseChanges;
