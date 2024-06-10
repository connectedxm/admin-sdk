import { GetAdminAPI } from "@src/AdminAPI";
// import { ConnectedXMResponse } from "@src/interfaces";
// import { QueryClient } from "@tanstack/react-query";
// import { EVENT_REGISTRATION_QUERY_KEY } from "../useGetEventRegistration";
// import useConnectedInfiniteQuery, {
//   InfiniteQueryParams,
// } from "@/context/queries/useConnectedInfiniteQuery";
// import { RegistrationQuestionWithResponse } from "../useGetEventRegistrationQuestionResponses";
// import { EVENT_REGISTRATION_GUEST_QUERY_KEY } from "./useGetEventRegistrationGuest";

// export const EVENT_REGISTRATION_GUEST_QUESTION_RESPONSES_QUERY_KEY = (
//   eventId: string,
//   registrationId: string,
//   guestId: string
// ) => [
//   ...EVENT_REGISTRATION_GUEST_QUERY_KEY(eventId, registrationId, guestId),
//   "RESPONSES",
// ];

// export const SET_EVENT_REGISTRATION_GUEST_QUESTIONS_RESPONSES_QUERY_DATA = (
//   client: QueryClient,
//   keyParams: Parameters<
//     typeof EVENT_REGISTRATION_GUEST_QUESTION_RESPONSES_QUERY_KEY
//   >,
//   response: Awaited<
//     ReturnType<typeof GetEventRegistrationGuestQuestionResponses>
//   >
// ) => {
//   client.setQueryData(
//     EVENT_REGISTRATION_GUEST_QUESTION_RESPONSES_QUERY_KEY(...keyParams),
//     response
//   );
// };

// interface GetEventRegistrationGuestQuestionResponsesProps
//   extends InfiniteQueryParams {
//   eventId: string;
//   registrationId: string;
//   guestId: string;
// }

// export const GetEventRegistrationGuestQuestionResponses = async ({
//   eventId,
//   registrationId,
//   guestId,
//   page,
//   pageSize,
//   orderBy,
//   search,
// }: GetEventRegistrationGuestQuestionResponsesProps): Promise<
//   ConnectedXMResponse<RegistrationQuestionWithResponse[]>
// > => {
//   const adminApi = await GetAdminAPI(adminApiParams);
//   const { data } = await adminApi.get(
//     `/events/${eventId}/registrations/${registrationId}/guests/${guestId}/questions`,
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

// const useGetEventRegistrationGuestQuestionResponses = (
//   eventId: string,
//   registrationId: string,
//   guestId: string
// ) => {
//   return useConnectedInfiniteQuery<
//     Awaited<ReturnType<typeof GetEventRegistrationGuestQuestionResponses>>
//   >(
//     EVENT_REGISTRATION_GUEST_QUESTION_RESPONSES_QUERY_KEY(
//       eventId,
//       registrationId,
//       guestId
//     ),
//     (params: any) => GetEventRegistrationGuestQuestionResponses(params),
//     {
//       eventId,
//       registrationId,
//       guestId,
//     },
//     {
//       enabled: !!eventId && !!registrationId && !!guestId,
//     }
//   );
// };

// export default useGetEventRegistrationGuestQuestionResponses;
