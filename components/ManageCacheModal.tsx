import { useCalculateCachedData } from "@/hooks/useCalculateCachedData";
import { useManageCacheModal } from "@/store/useManageCacheModal";

import CacheInfo from "./CacheInfo";
import Loader from "./Loader";
import Modal from "./Modal";

const ManageCacheModalContent = () => {
  const { cacheData, status, totalCacheSize } = useCalculateCachedData();

  return (
    <div className="h-[30rem]">
      <hr />
      <div className="flex gap-2 items-center justify-center pt-6 h-full">
        {status === "loading" && (
          <>
            <p>Calculating storage usage...</p>
            <Loader className="min-w-8" />
          </>
        )}

        {status === "loaded" && (
          <CacheInfo totalCacheSize={totalCacheSize} cacheData={cacheData} />
        )}

        {status === "error" && (
          <p className="text-rose-50">
            Error while calculating the cache size! ⚠️
          </p>
        )}
      </div>
    </div>
  );
};

const ManageCacheModal = () => {
  const { isOpen, onClose } = useManageCacheModal();

  return (
    <Modal
      title="Storage Usage"
      description="Manage the storage usage of MelodiMix"
      isOpen={isOpen}
      handleChange={(open) => !open && onClose()}
    >
      <ManageCacheModalContent />
    </Modal>
  );
};

export default ManageCacheModal;
