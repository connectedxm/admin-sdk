import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Account, Activity } from "@interfaces";
import { SET_ACCOUNT_QUERY_DATA } from "@context/queries/accounts/useGetAccount";
import { ACCOUNT_INTERESTS_QUERY_KEY } from "@context/queries/accounts/useGetAccountInterests";
import { SET_ACTIVITY_QUERY_DATA } from "@context/queries/activities/useGetActivity";
import { ACTIVITY_INTERESTS_QUERY_KEY } from "@context/queries/activities/useGetActivityInterests";

interface RemoveActivityInterestParams {
  activityId: string;
  interestId: string;
}

export const RemoveActivityInterest = async ({
  activityId,
  interestId,
}: RemoveActivityInterestParams): Promise<ConnectedXMResponse<Activity>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/activities/${activityId}/interests/${interestId}`
  );
  return data;
};

export const useRemoveActivityInterest = (activityId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (interestId: string) => RemoveActivityInterest({ activityId, interestId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveActivityInterest>>
      ) => {
        SET_ACTIVITY_QUERY_DATA(queryClient, [activityId], response);
        queryClient.invalidateQueries(ACTIVITY_INTERESTS_QUERY_KEY(activityId));
      },
    },
    undefined,
    true
  );
};

export default useRemoveActivityInterest;
