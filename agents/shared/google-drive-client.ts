import { google } from "googleapis";
import { readFileSync } from "node:fs";

const SCOPES = ["https://www.googleapis.com/auth/drive"];

function getAuth() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  if (!keyPath) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY_PATH nije postavljen u .env.local");
  }
  const key = JSON.parse(readFileSync(keyPath, "utf-8"));
  return new google.auth.GoogleAuth({ credentials: key, scopes: SCOPES });
}

function driveClient() {
  return google.drive({ version: "v3", auth: getAuth() });
}

/** Pronađe podfolder po imenu unutar parenta, ili ga kreira ako ne postoji. Vraća folder ID. */
export async function getOrCreateFolder(name: string, parentId: string): Promise<string> {
  const drive = driveClient();
  const q = `name = '${name.replace(/'/g, "\\'")}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const existing = await drive.files.list({ q, fields: "files(id, name)" });
  if (existing.data.files && existing.data.files.length > 0) {
    return existing.data.files[0].id as string;
  }
  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });
  return created.data.id as string;
}

/** Uploada tekstualni fajl (npr. output.md, run_log.json) u zadani folder. Prepisuje ako već postoji. */
export async function uploadTextFile(
  fileName: string,
  content: string,
  folderId: string,
  mimeType = "text/markdown"
): Promise<string> {
  const drive = driveClient();
  const q = `name = '${fileName.replace(/'/g, "\\'")}' and '${folderId}' in parents and trashed = false`;
  const existing = await drive.files.list({ q, fields: "files(id)" });

  const media = { mimeType, body: content };

  if (existing.data.files && existing.data.files.length > 0) {
    const fileId = existing.data.files[0].id as string;
    await drive.files.update({ fileId, media });
    return fileId;
  }

  const created = await drive.files.create({
    requestBody: { name: fileName, parents: [folderId] },
    media,
    fields: "id",
  });
  return created.data.id as string;
}

/** Čita sadržaj tekstualnog fajla po ID-u. */
export async function readTextFile(fileId: string): Promise<string> {
  const drive = driveClient();
  const res = await drive.files.get({ fileId, alt: "media" }, { responseType: "text" });
  return res.data as string;
}
