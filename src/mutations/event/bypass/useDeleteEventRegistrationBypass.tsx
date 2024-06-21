import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY } from "@context/queries/events/bypass/useGetEventRegistrationBypassList";
import { EVENT_REGISTRATION_BYPASS_QUERY_KEY } from "@context/queries/events/bypass/useGetEventRegistrationBypass";

interface DeleteEventRegistrationBypassParams {
  eventId: string;
  bypassId: number;
}

export const DeleteEventRegistrationBypass = async ({
  eventId,
  bypassId,
}: DeleteEventRegistrationBypassParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/bypass/${bypassId}`
  );
  return data;
};

export const useDeleteEventRegistrationBypass = (
  eventId: string,
  bypassId: number
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () => DeleteEventRegistrationBypass({ eventId, bypassId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteEventRegistrationBypass>>
      ) => {
        await router.push(`/events/${eventId}/bypass`);
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId)
        );
        queryClient.removeQueries(
          EVENT_REGISTRATION_BYPASS_QUERY_KEY(eventId, bypassId)
        );
      },
    }
  );
};

export default useDeleteEventRegistrationBypass;
