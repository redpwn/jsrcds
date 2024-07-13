import type { Loader, LoaderConfig } from "./loader";

export const getChallenges = async (
  loader: Loader<LoaderConfig>
): Promise<{
  challenges: any[];
  errors: any[];
}> => {
  const challenges: any[] = [];
  const errors: any[] = [];

  for (const challenge of await loader.getChallenges()) {
  }

  return { challenges, errors };
};
