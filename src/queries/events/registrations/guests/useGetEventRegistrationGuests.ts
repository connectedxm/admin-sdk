import { GetAdminAPI } from "@src/AdminAPI";
// import { ConnectedXMResponse } from "@src/interfaces";
// import {
//   Registration,
//   RegistrationGuest,
//   RegistrationStatus,
// } from "@src/interfaces";
// import useConnectedInfiniteQuery, {
//   InfiniteQueryParams,
// } from "../../../useConnectedInfiniteQuery";
// import { QueryClient } from "@tanstack/react-query";
// import { EVENT_REGISTRATION_QUERY_KEY } from "../useGetEventRegistration";

// export const EVENT_REGISTRATION_GUESTS_QUERY_KEY = (
//   eventId: string,
//   registrationId: string
// ) => [...EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId), "GUESTS"];

// export const SET_EVENT_REGISTRATION_GUESTS_QUERY_DATA = (
//   client: QueryClient,
//   keyParams: Parameters<typeof EVENT_REGISTRATION_GUESTS_QUERY_KEY>,
//   response: Awaited<ReturnType<typeof GetEventRegistrationGuests>>
// ) => {
//   client.setQueryData(
//     EVENT_REGISTRATION_GUESTS_QUERY_KEY(...keyParams),
//     response
//   );
// };

// interface GetEventRegistrationGuestsProps extends InfiniteQueryParams {
//   eventId: string;
//   registrationId: string;
// }

// export const GetEventRegistrationGuests = async ({
//   eventId,
//   page,
//   pageSize,
//   orderBy,
//   search,
//   registrationId,
// }: GetEventRegistrationGuestsProps): Promise<
//   ConnectedXMResponse<RegistrationGuest[]>
// > => {
//   const adminApi = await GetAdminAPI(adminApiParams);
//   const { data } = await adminApi.get(
//     `/events/${eventId}/registrations/${registrationId}/guests`,
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

// const useGetEventRegistrationGuests = (
//   eventId: string,
//   registrationId: string
// ) => {
//   return useConnectedInfiniteQuery<
//     Awaited<ReturnType<typeof GetEventRegistrationGuests>>
//   >(
//     EVENT_REGISTRATION_GUESTS_QUERY_KEY(eventId, registrationId),
//     (params: any) => GetEventRegistrationGuests(params),
//     {
//       eventId,
//       registrationId,
//     },
//     {
//       enabled: !!eventId && !!registrationId,
//     }
//   );
// };

// export default useGetEventRegistrationGuests;
