import { loadConfig } from "@/config";
import { StorageClient } from "@/utils/StorageClient";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

/**
 * Hook that provides a `uploadFile` function for uploading binary files
 * to blob storage and getting back a CDN URL.
 *
 * Uses the authenticated identity so that the certificate call to the
 * backend canister is signed — required for blob storage to work.
 */
export function useFileUpload() {
  const { isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const uploadFile = async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<string> => {
    const config = await loadConfig();

    const agentOptions: ConstructorParameters<typeof HttpAgent>[0] = {
      host: config.backend_host,
    };

    // Use the authenticated identity if available so certificate calls are signed
    if (identity) {
      agentOptions.identity = identity;
    }

    const agent = new HttpAgent(agentOptions);

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
