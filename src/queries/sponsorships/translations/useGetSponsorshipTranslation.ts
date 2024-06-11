import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipTranslation } from "@src/interfaces";
import { SPONSORSHIP_TRANSLATIONS_QUERY_KEY } from "./useGetSponsorshipTranslations";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedSingleQuery,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";

export const SPONSORSHIP_TRANSLATION_QUERY_KEY = (
  sponsorshipId: string,
  locale: string
) => [...SPONSORSHIP_TRANSLATIONS_QUERY_KEY(sponsorshipId), locale];

export const SET_SPONSORSHIP_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SPONSORSHIP_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsorshipTranslation>>
) => {
  client.setQueryData(
    SPONSORSHIP_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSponsorshipTranslationProps extends SingleQueryParams {
  sponsorshipId: string;
  locale: string;
}

export const GetSponsorshipTranslation = async ({
  sponsorshipId,
  locale,
  adminApiParams,
}: GetSponsorshipTranslationProps): Promise<
  ConnectedXMResponse<SponsorshipTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/sponsorships/${sponsorshipId}/translations/${locale}`
  );
  return data;
};
export const useGetSponsorshipTranslation = (
  sponsorshipId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSponsorshipTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSponsorshipTranslation>>(
    SPONSORSHIP_TRANSLATION_QUERY_KEY(sponsorshipId, locale),
    (params: SingleQueryParams) =>
      GetSponsorshipTranslation({
        sponsorshipId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled: !!sponsorshipId && !!locale && (options?.enabled ?? true),
    }
  );
};
