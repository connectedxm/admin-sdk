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
 * Creates a new translation for a specific benefit.
 * This function allows the creation of a translation for a benefit by specifying the benefit ID and locale.
 * It supports optional auto-translation and updates the query cache upon successful creation.
 * @name PostBenefitTranslation
 * @param {string} benefitId - The ID of the benefit
 * @param {string} locale - The locale for the translation
 * @param {[boolean]} autoTranslate - Whether to auto-translate the benefit description
 * @version 1.2
 **/

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
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<BenefitTranslation>>(
    `/benefits/${benefitId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );
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
  >(CreateBenefitTranslation, options, {
    domain: "benefits",
    type: "update",
  });
};