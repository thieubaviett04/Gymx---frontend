"use client";
import { HomeLayout } from "@/components/home-layout";
import FilterBar from "@/components/filter-bar";
import PackageCard from "@/components/package-card";
import { packages } from "@/data/packages";
import PackagePagination from "@/components/package-pagination";
import { useState, useEffect } from "react";
import CustomToast from "@/components/ui/custom-toast";
import { X } from "lucide-react";
import EmptyState from "@/components/empty-state";
import PackageDetailPanel from "@/components/package-detail-panel";
import RegisterModal from "@/components/register-modal";

export default function MembershipPage() {
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [durationFilter, setDurationFilter] = useState("all");
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedPackage, setSelectedPackage] = useState<{
    id: string;
    name: string;
    duration: string;
    price: string;
    description: string;
  } | null>(null);

  const [activePackageForDetail, setActivePackageForDetail] = useState<{
    id: string;
    name: string;
    duration: string;
    price: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cancelled") === "true") {
      setShowCancelAlert(true);
      params.delete("cancelled");
      const cleanUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState(null, "", cleanUrl);
      
      const timer = setTimeout(() => {
        setShowCancelAlert(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

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

    // search filter logic for other items
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const startIndex = (currentPage - 1) * pageSize;

  const currentPackages = filteredPackages.slice(
    startIndex,
    startIndex + pageSize
  );

  const totalPages = Math.ceil(filteredPackages.length / pageSize) || 1;

  return (
    <HomeLayout
      pageTitle="Đăng ký gói tập"
      pageSubtitle="Chọn gói tập phù hợp để bắt đầu hành trình tập luyện."
    >
      <CustomToast
        show={showError}
        type="error"
        message="Đã có lỗi xảy ra, vui lòng thử lại"
        onClose={() => setShowError(false)}
      />

      <CustomToast
        show={showCancelAlert}
        type="error"
        message="Thanh toán đã bị hủy"
        onClose={() => setShowCancelAlert(false)}
      />

      <PackageDetailPanel
        open={showDetail}
        onClose={() => {
          setShowDetail(false);
          setActivePackageForDetail(null);
        }}
        selectedPackage={activePackageForDetail}
        onRegister={() => {
          setSelectedPackage(activePackageForDetail);
          setShowDetail(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        open={showRegisterModal}
        onClose={() => {
          setShowRegisterModal(false);
          setSelectedPackage(null);
        }}
        selectedPackage={selectedPackage}
      />

      <div className="flex min-h-full flex-col gap-2">
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
              setCurrentPage(1);
            }}
          />
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="min-h-[500px]">
<div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
              {currentPackages.map((item) => (
                <PackageCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  duration={item.duration}
                  price={item.price}
                  description={item.description}
                  featured={item.id === "GT001"}
                  showDiscount={item.id === "GT001"}
                  onRegister={
                    item.id === "GT002"
                      ? handleFakeError
                      : () => {
                          setSelectedPackage(item);
                          setShowRegisterModal(true);
                        }
                  }
                  onDetail={() => {
  setActivePackageForDetail(item);

  setTimeout(() => {
    setShowDetail(true);
  }, 10);
}}
                />
              ))}
            </div>
</div>
         <div className="pt-1 border-t border-white/10">
              <PackagePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalItems={filteredPackages.length}
              />
            </div>
          </div>
        )}
      </div>
    </HomeLayout>
  );
}
