import { GetAdminAPI } from "@src/AdminAPI";
import { BenefitTranslation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BENEFIT_TRANSLATIONS_QUERY_KEY,
  SET_BENEFIT_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Benefit
 */
export interface CreateBenefitTranslationParams extends MutationParams {
  benefitId: string;
  locale: string;
  autoTranslate?: boolean;
}
/**
 * @category Methods
 * @group Benefit
 */
export const CreateBenefitTranslation = async ({
  benefitId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateBenefitTranslationParams): Promise<
  ConnectedXMResponse<BenefitTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<BenefitTranslation>
  >(`/benefits/${benefitId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BENEFIT_TRANSLATIONS_QUERY_KEY(benefitId),
    });
    SET_BENEFIT_TRANSLATION_QUERY_DATA(
      queryClient,
      [benefitId, data.data.locale],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Benefit
 */
export const useCreateBenefitTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBenefitTranslation>>,
      Omit<CreateBenefitTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBenefitTranslationParams,
    Awaited<ReturnType<typeof CreateBenefitTranslation>>
  >(CreateBenefitTranslation, options);
};
