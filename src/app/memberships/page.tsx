"use client";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/top-bar";
import FilterBar from "@/components/filter-bar";
import PackageCard from "@/components/package-card";
import { packages } from "@/data/packages";
import PackagePagination from "@/components/package-pagination";
import { useEffect, useState } from "react";
import ErrorToast from "@/components/error-toast";
import EmptyState from "@/components/empty-state";
import PackageDetailPanel from "@/components/package-detail-panel";
import RegisterModal from "@/components/register-modal";

export default function MembershipPage() {
  const [showError, setShowError] = useState(false);
  const [showDetail, setShowDetail] =
    useState(false);

  const [showRegisterModal, setShowRegisterModal] =
    useState(false);

  const [durationFilter, setDurationFilter] =
    useState("all");

    const [pageSize, setPageSize] =
  useState(6);

const [currentPage, setCurrentPage] =
  useState(1);
  
  const [searchTerm, setSearchTerm] =
    useState("");

  const handleFakeError = () => {
    setShowError(true);

    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  const filteredPackages = packages.filter((item) => {

    // tìm "Gói tập cơ bản"
    if (
      searchTerm.trim().toLowerCase() ===
      "gói tập cơ bản"
    ) {
      return (
        item.id === "GT001" ||
        item.id === "GT002" ||
        item.id === "GT003"
      );
    }

    // giả lập > 6 tháng = không có kết quả
    if (durationFilter === "gt6") {
      return false;
    }

    return true;
  });
const startIndex =
  (currentPage - 1) * pageSize;

const currentPackages =
  filteredPackages.slice(
    startIndex,
    startIndex + pageSize
  );

const totalPages =
  Math.ceil(
    filteredPackages.length /
      pageSize
  );
  return (
    <>
      <ErrorToast show={showError} />

      <PackageDetailPanel
        open={showDetail}
        onClose={() => setShowDetail(false)}
        onRegister={() => {
          setShowDetail(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        open={showRegisterModal}
        onClose={() =>
          setShowRegisterModal(false)
        }
      />

      <div className="flex h-screen bg-neutral-100 font-sans">
        {/* Sidebar */}
        <aside className="w-[220px] border-r">
          <Sidebar />
        </aside>

        <main
          className="flex-1 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48')",
          }}
        >
        <div className="flex h-full flex-col bg-black/70 px-6 py-4">
            <Topbar />

            <FilterBar
              durationFilter={durationFilter}
              setDurationFilter={setDurationFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {filteredPackages.length === 0 ? (
              <EmptyState
                onClear={() => {
                  setDurationFilter("all");
                  setSearchTerm("");
                }}
              />
            ) : (
              <>
<div className="flex  flex-1 flex-col">
  <div className="flex-1">
   <div className="grid grid-cols-3 gap-3">
                  {currentPackages.map((item) => (
                    <PackageCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      duration={item.duration}
                      price={item.price}
                      description={item.description}
                      featured={item.id === "GT001"}
                      onRegister={
                        item.id === "GT002"
                          ? handleFakeError
                          : () => setShowRegisterModal(true)
                      }
                      onDetail={
                        item.id === "GT001"
                          ? () => setShowDetail(true)
                          : undefined
                      }
                    />
                  ))}
                </div>
</div>

<div className="mt-auto pb-6">
             <PackagePagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  pageSize={pageSize}
  setPageSize={setPageSize}
  totalItems={filteredPackages.length}
/></div>
</div>
              </>
            )}
          </div>
          
        </main>
      </div>
    </>
  );
}