import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EventOnSite } from "@interfaces";
import { SET_EVENT_ON_SITE_QUERY_DATA } from "@context/queries/events/on-site/useGetEventOnSite";

interface UpdateEventCheckinCodeParams {
  eventId: string;
}

export const UpdateEventCheckinCode = async ({
  eventId,
}: UpdateEventCheckinCodeParams): Promise<ConnectedXMResponse<EventOnSite>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/events/${eventId}/on-site`);
  return data;
};

export const useUpdateEventCheckinCode = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(() => UpdateEventCheckinCode({ eventId }), {
    onSuccess: (
      response: Awaited<ReturnType<typeof UpdateEventCheckinCode>>
    ) => {
      SET_EVENT_ON_SITE_QUERY_DATA(queryClient, [eventId], response);
    },
  });
};

export default useUpdateEventCheckinCode;
