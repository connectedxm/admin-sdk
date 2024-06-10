import { GetAdminAPI } from "@src/AdminAPI";
// import { ConnectedXMResponse } from "@src/interfaces";
// import { RegistrationGuest } from "@src/interfaces";
// import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
// import { EVENT_REGISTRATION_GUESTS_QUERY_KEY } from "./useGetEventRegistrationGuests";

// export const EVENT_REGISTRATION_GUEST_QUERY_KEY = (
//   eventId: string,
//   registrationId: string,
//   guestId: string
// ) => [...EVENT_REGISTRATION_GUESTS_QUERY_KEY(eventId, registrationId), guestId];

// export const SET_EVENT_REGISTRATION_GUEST_QUERY_DATA = (
//   client: any,
//   keyParams: Parameters<typeof EVENT_REGISTRATION_GUEST_QUERY_KEY>,
//   response: Awaited<ReturnType<typeof GetEventRegistrationGuest>>
// ) => {
//   client.setQueryData(
//     EVENT_REGISTRATION_GUEST_QUERY_KEY(...keyParams),
//     response
//   );
// };

// interface GetEventRegistrationGuestProps {
//   eventId: string;
//   registrationId: string;
//   guestId: string;
// }

// export const GetEventRegistrationGuest = async ({
//   eventId,
//   registrationId,
//   guestId,
// }: GetEventRegistrationGuestProps): Promise<
//   ConnectedXMResponse<RegistrationGuest>
// > => {
//   const adminApi = await GetAdminAPI(adminApiParams);
//   const { data } = await adminApi.get(
//     `/events/${eventId}/registrations/${registrationId}/guests/${guestId}`
//   );
//   return data;
// };

// const useGetEventRegistrationGuest = (
//   eventId: string,
//   registrationId: string,
//   guestId: string
// ) => {
//   return useConnectedSingleQuery<
//     Awaited<ReturnType<typeof GetEventRegistrationGuest>>
//   >(
//     EVENT_REGISTRATION_GUEST_QUERY_KEY(eventId, registrationId, guestId),
//     () => GetEventRegistrationGuest({ eventId, registrationId, guestId }),
//     {
//       enabled: !!eventId && !!registrationId && !!guestId,
//     }
//   );
// };

// export default useGetEventRegistrationGuest;
