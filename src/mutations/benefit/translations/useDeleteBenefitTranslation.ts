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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
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
