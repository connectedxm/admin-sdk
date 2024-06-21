import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Benefit } from "@interfaces";
import { BENEFITS_QUERY_KEY } from "@context/queries/benefits/useGetBenefits";
import { SET_BENEFIT_QUERY_DATA } from "@context/queries/benefits/useGetBenefit";

interface RemoveEventBenefitParams {
  benefitId: string;
  eventId: string;
}

export const RemoveEventBenefit = async ({
  benefitId,
  eventId,
}: RemoveEventBenefitParams): Promise<ConnectedXMResponse<Benefit>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/benefits/${benefitId}`
  );
  return data;
};

export const useRemoveEventBenefit = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (benefitId: string) => RemoveEventBenefit({ benefitId, eventId }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof RemoveEventBenefit>>) => {
        queryClient.invalidateQueries(BENEFITS_QUERY_KEY());
        SET_BENEFIT_QUERY_DATA(queryClient, [response.data.id], response);
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventBenefit;
