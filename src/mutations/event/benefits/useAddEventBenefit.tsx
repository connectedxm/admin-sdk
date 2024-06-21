import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { BENEFITS_QUERY_KEY } from "@context/queries/benefits/useGetBenefits";
import { SET_BENEFIT_QUERY_DATA } from "@context/queries/benefits/useGetBenefit";
import { Benefit } from "@interfaces";

interface AddEventBenefitParams {
  benefitId: string;
  eventId: string;
}

export const AddEventBenefit = async ({
  benefitId,
  eventId,
}: AddEventBenefitParams): Promise<ConnectedXMResponse<Benefit>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/benefits/${benefitId}`
  );
  return data;
};

export const useAddEventBenefit = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (benefitId: string) => AddEventBenefit({ benefitId, eventId }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof AddEventBenefit>>) => {
        queryClient.invalidateQueries(BENEFITS_QUERY_KEY());
        SET_BENEFIT_QUERY_DATA(queryClient, [response.data.id], response);
      },
    }
  );
};

export default useAddEventBenefit;
