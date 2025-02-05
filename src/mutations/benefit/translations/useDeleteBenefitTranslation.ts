import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BENEFIT_TRANSLATIONS_QUERY_KEY,
  BENEFIT_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific benefit translation for a given benefit ID and locale.
 * This function is used to remove translations associated with a benefit, ensuring that the translation data is no longer available.
 * It is typically used in administrative interfaces where managing benefit translations is required.
 * @name DeleteBenefitTranslation
 * @param {string} benefitId - The ID of the benefit
 * @param {string} locale - The locale of the translation to be deleted
 * @version 1.2
 **/

/**
 * @category Params
 * @group Benefit-Translation
 */
export interface DeleteBenefitTranslationParams extends MutationParams {
  benefitId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Benefit-Translation
 */
export const DeleteBenefitTranslation = async ({
  benefitId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteBenefitTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/benefits/${benefitId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BENEFIT_TRANSLATIONS_QUERY_KEY(benefitId),
    });
    queryClient.invalidateQueries({
      queryKey: BENEFIT_TRANSLATION_QUERY_KEY(benefitId, locale),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Benefit-Translation
 */
export const useDeleteBenefitTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteBenefitTranslation>>,
      Omit<DeleteBenefitTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteBenefitTranslationParams,
    Awaited<ReturnType<typeof DeleteBenefitTranslation>>
  >(DeleteBenefitTranslation, options, {
    domain: "benefits",
    type: "update",
  });
};