import { loadConfig } from "@/config";
import { StorageClient } from "@/utils/StorageClient";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useActor } from "./useActor";

/**
 * Hook that provides a `uploadFile` function for uploading binary files
 * to blob storage and getting back a CDN URL.
 *
 * This mirrors the pattern used in config.ts's `createActorWithConfig`,
 * but exposes it to components that need to upload files before calling
 * backend mutations (gallery images, class material PDFs, etc.)
 */
export function useFileUpload() {
  const { isFetching } = useActor();

  const uploadFile = async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<string> => {
    const config = await loadConfig();

    const agent = new HttpAgent({
      host: config.backend_host,
    });

    if (config.backend_host?.includes("localhost")) {
      await agent.fetchRootKey().catch(() => {
        // Ignore on local dev
      });
    }

    const storageClient = new StorageClient(
      config.bucket_name,
      config.storage_gateway_url,
      config.backend_canister_id,
      config.project_id,
      agent,
    );

    const bytes = new Uint8Array(await file.arrayBuffer());
    const { hash } = await storageClient.putFile(bytes, onProgress);
    const url = await storageClient.getDirectURL(hash);
    return url;
  };

  return { uploadFile, isActorReady: !isFetching };
}
