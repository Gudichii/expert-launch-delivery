import { research, type LandingResearchInput } from "./steps/01_research.ts";
import { avatar } from "./steps/02_avatar.ts";
import { struktura } from "./steps/03_struktura.ts";
import { fullCopy } from "./steps/04_full_copy.ts";
import { build } from "./steps/05_build.ts";
import { qaCheck } from "./steps/06_qa_check.ts";
import { getOrCreateFolder, uploadTextFile } from "@shared/google-drive-client.ts";
import { setAgentStatus } from "@shared/google-sheets-client.ts";

/**
 * Orkestracija: research -> avatar -> struktura -> full copy -> build -> qa check.
 * Rezultat i run_log.json se spremaju na Drive u /Klijenti/{klijent-slug}/landing-page/.
 */
export async function runLandingPage(
  klijentSlug: string,
  input: LandingResearchInput,
  postojeciAvatarDriveFileId?: string
) {
  await setAgentStatus(klijentSlug, "landing_page", "u tijeku");

  const researchOutput = await research(input);
  const avatarOutput = await avatar(researchOutput, postojeciAvatarDriveFileId);
  const strukturaOutput = await struktura(avatarOutput);
  const copy = await fullCopy(strukturaOutput);
  const output = await build(copy);
  const qa = await qaCheck(output);

  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID as string;
  const klijentFolder = await getOrCreateFolder(klijentSlug, rootFolderId);
  const agentFolder = await getOrCreateFolder("landing-page", klijentFolder);

  await uploadTextFile("output.html", output, agentFolder, "text/html");
  await uploadTextFile(
    "run_log.json",
    JSON.stringify({ input, output, qa, timestamp: new Date().toISOString() }, null, 2),
    agentFolder,
    "application/json"
  );

  await setAgentStatus(klijentSlug, "landing_page", qa.flagirajZaReview ? "gotovo" : "provjereno");
}
