import { research, type ResearchInput } from "./steps/01_research.ts";
import { avatar } from "./steps/02_avatar.ts";
import { struktura } from "./steps/03_struktura.ts";
import { fullCopy } from "./steps/04_full_copy.ts";
import { qaCheck } from "./steps/05_qa_check.ts";
import { getOrCreateFolder, uploadTextFile } from "@shared/google-drive-client.ts";
import { setAgentStatus } from "@shared/google-sheets-client.ts";

/**
 * Orkestracija: research -> avatar -> struktura -> full copy -> qa check.
 * Rezultat i run_log.json se spremaju na Drive u /Klijenti/{klijent-slug}/content-strategija/.
 */
export async function runContentStrategija(klijentSlug: string, input: ResearchInput) {
  await setAgentStatus(klijentSlug, "content_strategija", "u tijeku");

  const researchOutput = await research(input);
  const avatarOutput = await avatar(researchOutput);
  const strukturaOutput = await struktura(avatarOutput);
  const output = await fullCopy(strukturaOutput);
  const qa = await qaCheck(output);

  // TODO: root folder ID treba doći iz GOOGLE_DRIVE_ROOT_FOLDER_ID / config po klijentu
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID as string;
  const klijentFolder = await getOrCreateFolder(klijentSlug, rootFolderId);
  const agentFolder = await getOrCreateFolder("content-strategija", klijentFolder);

  await uploadTextFile("output.md", output, agentFolder);
  await uploadTextFile(
    "run_log.json",
    JSON.stringify({ input, output, qa, timestamp: new Date().toISOString() }, null, 2),
    agentFolder,
    "application/json"
  );

  await setAgentStatus(klijentSlug, "content_strategija", qa.flagirajZaReview ? "gotovo" : "provjereno");
}
