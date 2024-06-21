import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { EventRegistrationBypass } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY } from "@context/queries/events/bypass/useGetEventRegistrationBypassList";
import { SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA } from "@context/queries/events/bypass/useGetEventRegistrationBypass";

interface UpdateEventRegistrationBypassParams {
  eventId: string;
  bypassId: number;
  page: EventRegistrationBypass;
}

export const UpdateEventRegistrationBypass = async ({
  eventId,
  bypassId,
  page,
}: UpdateEventRegistrationBypassParams): Promise<
  ConnectedXMResponse<EventRegistrationBypass>
> => {
  if (!bypassId) throw new Error("Page ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/bypass/${bypassId}`,
    {
      ...page,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  return data;
};

export const useUpdateEventRegistrationBypass = (
  eventId: string,
  bypassId: number
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventRegistrationBypass>(
    (page: EventRegistrationBypass) =>
      UpdateEventRegistrationBypass({
        eventId,
        bypassId,
        page,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventRegistrationBypass>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId)
        );
        SET_EVENT_REGISTRATION_BYPASS_QUERY_DATA(
          queryClient,
          [eventId, bypassId || response.data?.id],
          response
        );
      },
    }
  );
};

export default useUpdateEventRegistrationBypass;
