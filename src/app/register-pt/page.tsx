"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { HomeLayout } from "@/components/home-layout";
import { useRouter } from "next/navigation";
import {
  Search,
  Star,
  User,
  Clock,
  ArrowLeft,
  Calendar,
  ChevronRight,
  Check,
  X,
  ChevronDown,
  Info,
  SlidersHorizontal,
  Dumbbell,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Define Trainer interface
interface Trainer {
  id: string;
  name: string;
  gender: "Nam" | "Nữ";
  experience: number; // years
  rating: number;
  category: string; // "Gym tổng hợp", "Pilates", "Calisthenics", etc.
  price: number; // e.g. 150000
  avatar: string;
  services: string[];
  bio: string;
  reviewsCount: number;
  reviews: { author: string; rating: number; comment: string }[];
}

// 14 trainers to match mockup counts
const MOCK_TRAINERS: Trainer[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    gender: "Nam",
    experience: 5,
    rating: 4.8,
    category: "Gym tổng hợp",
    price: 150000,
    avatar: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=150&q=80",
    services: ["Tăng cơ", "Hypertrophy training", "Lean bulk program"],
    bio: "Huấn luyện viên chuyên nghiệp với hơn 5 năm kinh nghiệm chuyên về phát triển cơ bắp, giảm mỡ và tối ưu hóa hiệu suất tập luyện. Cam kết đồng hành cùng học viên đạt mục tiêu.",
    reviewsCount: 3,
    reviews: [
      { author: "Hội viên A", rating: 5, comment: "PT rất tận tâm, chỉ dẫn kỹ thuật rất chi tiết và dễ hiểu." }
    ]
  },
  {
    id: "2",
    name: "Nguyễn Thị B",
    gender: "Nữ",
    experience: 5,
    rating: 4.8,
    category: "Pilates",
    price: 150000,
    avatar: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=150&q=80",
    services: ["Pilates cơ bản", "Cân bằng cơ thể", "Phục hồi cột sống"],
    bio: "Chuyên gia Pilates với mong muốn cải thiện tư thế, độ linh hoạt và sức mạnh cột cốt lõi cho mọi học viên thông qua các bài tập điều chỉnh chuyên sâu.",
    reviewsCount: 5,
    reviews: [
      { author: "Khách hàng Minh", rating: 5, comment: "Lớp học Pilates của chị B rất thoải mái nhưng hiệu quả cao." }
    ]
  },
  {
    id: "3",
    name: "Trần Minh C",
    gender: "Nữ",
    experience: 7,
    rating: 4.8,
    category: "Calisthenics",
    price: 150000,
    avatar: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=150&q=80",
    services: ["Tăng cơ", "Calisthenics nâng cao", "Kiểm soát cơ thể"],
    bio: "Huấn luyện viên với hơn 7 năm kinh nghiệm chuyên sâu về Street Workout và Calisthenics. Đã giúp hàng trăm học viên làm chủ các kỹ năng giữ thăng bằng và sức mạnh tự nhiên.",
    reviewsCount: 3,
    reviews: [
      { author: "Hội viên A", rating: 5, comment: "Không gian tập luyện và hướng dẫn rất tuyệt vời!" }
    ]
  },
  {
    id: "4",
    name: "Nguyễn Văn A",
    gender: "Nam",
    experience: 5,
    rating: 4.8,
    category: "Cardio - Aerobic",
    price: 150000,
    avatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=150&q=80",
    services: ["Giảm cân cấp tốc", "Cardio cường độ cao", "Cải thiện tim mạch"],
    bio: "Sự nhiệt huyết và năng lượng tích cực là phương châm huấn luyện của tôi. Giúp bạn giải phóng năng lượng thừa và có một hệ tim mạch dẻo dai.",
    reviewsCount: 2,
    reviews: [
      { author: "Hội viên Lan", rating: 4.8, comment: "Giờ tập rất vui và đốt calo cực tốt." }
    ]
  },
  {
    id: "5",
    name: "Lê Thị D",
    gender: "Nữ",
    experience: 5,
    rating: 4.8,
    category: "Powerlifting",
    price: 150000,
    avatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=150&q=80",
    services: ["Tăng sức mạnh", "Kỹ thuật Squat/Bench/Deadlift", "Bứt phá giới hạn"],
    bio: "Đam mê nâng tạ nặng và mong muốn lan tỏa kỹ thuật Powerlifting an toàn, hiệu quả đến với tất cả những ai muốn thử thách sức mạnh tối đa của bản thân.",
    reviewsCount: 4,
    reviews: [
      { author: "Hội viên Hoàng", rating: 5, comment: "Chỉ bảo kỹ thuật Deadlift cực kỳ chi tiết, giúp mình không bị đau lưng nữa." }
    ]
  },
  {
    id: "6",
    name: "Nguyễn Văn A",
    gender: "Nam",
    experience: 5,
    rating: 4.8,
    category: "Boxing",
    price: 150000,
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80",
    services: ["Boxing cơ bản", "Đốt mỡ nhanh", "Phản xạ tự vệ"],
    bio: "Tập trung vào kỹ thuật đấm, di chuyển chân và thể lực chiến đấu. Boxing không chỉ rèn luyện cơ thể mà còn giải tỏa stress cực tốt.",
    reviewsCount: 6,
    reviews: [
      { author: "Hội viên Hùng", rating: 5, comment: "PT siêu vui tính nhưng tập cực kỳ nghiêm túc!" }
    ]
  },
  {
    id: "7",
    name: "Nguyễn Văn A",
    gender: "Nam",
    experience: 5,
    rating: 4.8,
    category: "Phục hồi",
    price: 150000,
    avatar: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=150&q=80",
    services: ["Giãn cơ chuyên sâu", "Phục hồi sau chấn thương", "Cân bằng cơ học"],
    bio: "Đồng hành phục hồi chuyển động tự nhiên cho cơ thể. Rất thích hợp cho người bị đau mỏi vai gáy hoặc sau chấn thương thể thao.",
    reviewsCount: 3,
    reviews: [
      { author: "Chị Thảo", rating: 5, comment: "Giãn cơ xong người nhẹ hẳn đi, trị liệu đau vai gáy rất tốt." }
    ]
  },
  {
    id: "8",
    name: "Nguyễn Thị B",
    gender: "Nữ",
    experience: 5,
    rating: 4.8,
    category: "Yoga",
    price: 150000,
    avatar: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=150&q=80",
    services: ["Hatha Yoga", "Vinyasa Flow", "Thiền định thư giãn"],
    bio: "Học Yoga là học cách thấu hiểu chính mình. Giúp học viên tìm lại sự tĩnh lặng trong tâm hồn kết hợp phát triển cơ thể dẻo dai.",
    reviewsCount: 8,
    reviews: [
      { author: "Cô Mai", rating: 5, comment: "Cô giáo nhẹ nhàng, hướng dẫn rất cẩn thận phù hợp cho người lớn tuổi." }
    ]
  },
  {
    id: "9",
    name: "Trần Minh C",
    gender: "Nữ",
    experience: 5,
    rating: 4.7,
    category: "Powerlifting",
    price: 150000,
    avatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=150&q=80",
    services: ["Kỹ thuật tạ nặng", "Giáo án tăng cơ lực", "Tối ưu hóa form tập"],
    bio: "Tự tin bứt phá giới hạn tạ của bạn. Đảm bảo form dáng chuẩn xác để phòng tránh chấn thương hiệu quả nhất.",
    reviewsCount: 3,
    reviews: [
      { author: "Hội viên Nam", rating: 4.7, comment: "Giúp mình cải thiện kỹ thuật Squat đáng kể." }
    ]
  },
  {
    id: "10",
    name: "Phạm Quốc Dũng",
    gender: "Nam",
    experience: 6,
    rating: 4.9,
    category: "Gym tổng hợp",
    price: 160000,
    avatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80",
    services: ["Giảm cân", "Tăng cơ nhanh", "Dinh dưỡng thể hình"],
    bio: "Huấn luyện viên kiêm chuyên gia tư vấn dinh dưỡng. Đảm bảo mang lại kết quả thay đổi vóc dáng rõ rệt sau 3 tháng cam kết.",
    reviewsCount: 10,
    reviews: [
      { author: "Hội viên Huy", rating: 5, comment: "Chế độ ăn PT thiết kế rất dễ theo và hiệu quả nhanh." }
    ]
  },
  {
    id: "11",
    name: "Hoàng Thanh Hà",
    gender: "Nữ",
    experience: 4,
    rating: 4.6,
    category: "Pilates",
    price: 170000,
    avatar: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=150&q=80",
    services: ["Pilates với máy", "Thon gọn vóc dáng", "Chỉnh sửa cột sống"],
    bio: "Mang đến những buổi tập Pilates năng động, giúp kiến tạo vóc dáng mảnh mai và thon gọn tự nhiên.",
    reviewsCount: 2,
    reviews: [
      { author: "Hội viên Ngọc", rating: 4.8, comment: "Phòng máy sạch đẹp, HLV Hà hướng dẫn chu đáo." }
    ]
  },
  {
    id: "12",
    name: "Lê Minh Tuấn",
    gender: "Nam",
    experience: 8,
    rating: 4.9,
    category: "Calisthenics",
    price: 180000,
    avatar: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80",
    services: ["Bodyweight Control", "Luyện kỹ năng Muscle Up", "Tăng sức bền"],
    bio: "Chuyên gia phát triển thể chất toàn diện chỉ bằng cân nặng cơ thể. Hướng dẫn bài bản từ cơ bản đến những động tác thăng hoa nhất.",
    reviewsCount: 7,
    reviews: [
      { author: "Hội viên Vũ", rating: 5, comment: "Thầy Tuấn dạy Muscle Up cực hay, mình đã làm được sau 2 tuần học!" }
    ]
  },
  {
    id: "13",
    name: "Bùi Tuyết Mai",
    gender: "Nữ",
    experience: 6,
    rating: 4.8,
    category: "Yoga",
    price: 150000,
    avatar: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=150&q=80",
    services: ["Astanga Yoga", "Yoga trị liệu", "Giải tỏa áp lực"],
    bio: "Huấn luyện viên kiêm chuyên gia phục hồi sức khỏe, giảng dạy Yoga trị liệu hiệu quả.",
    reviewsCount: 4,
    reviews: [
      { author: "Hội viên An", rating: 5, comment: "Các bài tập thở giúp mình ngủ ngon hơn nhiều." }
    ]
  },
  {
    id: "14",
    name: "Vũ Đức Thịnh",
    gender: "Nam",
    experience: 10,
    rating: 5.0,
    category: "Boxing",
    price: 200000,
    avatar: "https://images.unsplash.com/photo-1491756906566-7120ecb3192f?auto=format&fit=crop&w=150&q=80",
    services: ["Kickboxing", "Kỹ thuật đấm nâng cao", "Thể lực võ sĩ"],
    bio: "Cựu vận động viên boxing quốc gia. Hướng dẫn trực tiếp các kỹ thuật thi đấu chuẩn xác và rèn luyện tinh thần thép.",
    reviewsCount: 12,
    reviews: [
      { author: "Hội viên Kiên", rating: 5, comment: "Kỹ năng thực chiến của thầy Thịnh đẳng cấp thế giới." }
    ]
  }
];

const SPECIALTIES = [
  "Tất cả chuyên môn",
  "Gym tổng hợp",
  "Pilates",
  "Calisthenics",
  "Cardio - Aerobic",
  "Powerlifting",
  "Boxing",
  "Phục hồi",
  "Yoga"
];

const TIME_SLOTS = [
  { time: "07:00", available: true },
  { time: "08:00", available: true },
  { time: "09:00", available: true },
  { time: "10:00", available: false }, // booked
  { time: "11:00", available: true },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: false }, // booked
  { time: "18:00", available: true }
];

const SERVICES_OPTIONS = [
  {
    id: "co_ban",
    name: "Tăng cơ cơ bản",
    price: 150000,
    description: "1 buổi/tháng với chuyên gia dinh dưỡng"
  },
  {
    id: "chuyen_sau",
    name: "Tăng cơ chuyên sâu",
    price: 220000,
    description: "Tập trung vào kỹ thuật và giáo án hypertrophy"
  }
];

export default function RegisterPTPage() {
  const router = useRouter();

  // Navigation / Flow states
  const [step, setStep] = useState<"list" | "form">("list");
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  // Drawer / Modal states
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("Tất cả giới tính");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Temporary filter states for dropdown form
  const [tempGender, setTempGender] = useState("Tất cả giới tính");
  const [tempRating, setTempRating] = useState<number | null>(null);
  const [tempCategories, setTempCategories] = useState<string[]>([]);

  // Synchronize temp filters with active filters when opening
  const handleOpenDropdown = () => {
    setTempGender(selectedGender);
    setTempRating(selectedRating);
    setTempCategories(selectedCategories);
    setIsFilterDropdownOpen(true);
  };

  // Pagination states
  const [pageSize, setPageSize] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  // Booking Form states
  const [bookingDate, setBookingDate] = useState("2026-05-28"); // default date mimicking mockup 28/05/2026
  const [bookingDuration, setBookingDuration] = useState("1 giờ");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>("18:00"); // pre-selected like mockup
  const [selectedServices, setSelectedServices] = useState<string[]>(["co_ban"]); // pre-selected like mockup

  // Reset form when changing PT
  const handleTrainerSelect = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setBookingDuration("1 giờ");
    setSelectedTimeSlot(null);
    setSelectedServices([]);
    setStep("form");
  };

  const handleOpenDetailDrawer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsDetailDrawerOpen(true);
  };

  // Filter trainers
  const filteredTrainers = useMemo(() => {
    return MOCK_TRAINERS.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchGender =
        selectedGender === "Tất cả giới tính" ||
        (selectedGender === "Nam" && t.gender === "Nam") ||
        (selectedGender === "Nữ" && t.gender === "Nữ");

      const matchRating =
        selectedRating === null ||
        (selectedRating === 5 && t.rating >= 5.0) ||
        (selectedRating === 4 && t.rating >= 4.0) ||
        (selectedRating === 3 && t.rating >= 3.0);

      const matchSpecialty =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) => {
          if (cat === "Gym tổng hợp") return t.category === "Gym tổng hợp";
          if (cat === "Tăng cơ") return t.category === "Gym tổng hợp" || t.services.some(s => s.includes("Tăng cơ"));
          if (cat === "Giảm cân") return t.services.some(s => s.includes("Giảm cân") || s.includes("giảm mỡ"));
          if (cat === "Cardio") return t.category === "Cardio - Aerobic" || t.services.some(s => s.includes("Cardio") || s.includes("Aerobic"));
          return false;
        });

      return matchSearch && matchGender && matchRating && matchSpecialty;
    });
  }, [searchQuery, selectedGender, selectedRating, selectedCategories]);

  // Paginated trainers
  const paginatedTrainers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTrainers.slice(startIndex, startIndex + pageSize);
  }, [filteredTrainers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTrainers.length / pageSize) || 1;

  // Calculate bill pricing
  const billSummary = useMemo(() => {
    if (!selectedTrainer) return { durationCost: 0, servicesCost: 0, discount: 0, total: 0 };
    
    // Duration factor
    let durationMultiplier = 1;
    if (bookingDuration === "1.5 giờ") durationMultiplier = 1.5;
    else if (bookingDuration === "2 giờ") durationMultiplier = 2;
    else if (bookingDuration === "2.5 giờ") durationMultiplier = 2.5;

    const durationCost = selectedTrainer.price * durationMultiplier;

    // Services cost
    let servicesCost = 0;
    selectedServices.forEach((serviceId) => {
      const opt = SERVICES_OPTIONS.find((s) => s.id === serviceId);
      if (opt) servicesCost += opt.price;
    });

    const subtotal = durationCost + servicesCost;

    // Discount if 2 or more services are selected
    let discount = 0;
    if (selectedServices.length >= 2) {
      discount = subtotal * 0.1; // 10% discount
    }

    const total = subtotal - discount;

    return {
      durationCost,
      servicesCost,
      discount,
      total
    };
  }, [selectedTrainer, bookingDuration, selectedServices]);

  // Calculate end time
  const endTime = useMemo(() => {
    if (!selectedTimeSlot) return "--";
    const [hours, minutes] = selectedTimeSlot.split(":").map(Number);
    let durationHours = 1;
    if (bookingDuration === "1.5 giờ") durationHours = 1.5;
    else if (bookingDuration === "2 giờ") durationHours = 2;
    else if (bookingDuration === "2.5 giờ") durationHours = 2.5;

    const totalMinutes = hours * 60 + minutes + durationHours * 60;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
  }, [selectedTimeSlot, bookingDuration]);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleBookingSubmit = () => {
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  // Format money helper
  const formatMoney = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  return (
    <HomeLayout
      pageTitle="Đăng ký tập với HLV"
      pageSubtitle={
        step === "list" ? (
          "Chọn một huấn luyện viên bên dưới để bắt đầu."
        ) : (
          <Breadcrumb>
            <BreadcrumbList className="text-neutral-400">
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={(props) => (
                    <button
                      {...props}
                      type="button"
                      onClick={() => setStep("list")}
                      className="cursor-pointer text-neutral-400 hover:text-white transition-colors"
                    />
                  )}
                >
                  Danh sách huấn luyện viên
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-neutral-500" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-neutral-200 font-semibold">Chọn thời gian</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )
      }
    >
      <div className="w-full animate-in fade-in duration-300">
        
        {/* STEP 1: TRAINER LIST */}
        {step === "list" && (
          <div className="space-y-6">
            
            {/* Header controls & tabs matching design */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
              
              {/* Tab Label with thick orange left border, styled as a white box to match mockup */}
              <div className="flex items-center bg-white px-4 py-2.5 rounded-xl border border-neutral-100 shadow-2xs">
                <div className="h-4 w-1 rounded-full bg-[#FF6B00] mr-2.5" />
                <span className="text-sm font-bold text-neutral-800">Danh sách huấn luyện viên</span>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-3 flex-1 md:flex-none justify-end">
                {/* Filter dropdown button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (isFilterDropdownOpen) {
                        setIsFilterDropdownOpen(false);
                      } else {
                        handleOpenDropdown();
                      }
                    }}
                    className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 shadow-2xs cursor-pointer select-none"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-[#FF6B00]" />
                    <span>Lọc</span>
                    <ChevronDown className={cn("h-4 w-4 text-[#FF6B00] transition-transform", isFilterDropdownOpen && "rotate-180")} />
                  </button>

                  {/* Dropdown panel matching user's custom filter design */}
                  {isFilterDropdownOpen && (
                    <div className="absolute left-0 mt-2 z-35 w-[360px] rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl text-neutral-800 animate-in fade-in-50 zoom-in-95 duration-150">
                      <div className="space-y-5">
                        
                        {/* Title with left orange line */}
                        <div className="flex items-center mb-1">
                          <div className="h-5 w-1 rounded-full bg-[#FF6B00] mr-2.5" />
                          <span className="text-base font-bold text-neutral-900">Bộ lọc huấn luyện viên</span>
                        </div>

                        {/* Giới tính */}
                        <div className="space-y-3">
                          <span className="block text-sm font-bold text-neutral-800">Giới tính</span>
                          <div className="flex items-center gap-6">
                            {[
                              { label: "Nam", value: "Nam" },
                              { label: "Nữ", value: "Nữ" },
                              { label: "Tất cả", value: "Tất cả giới tính" }
                            ].map((opt) => {
                              const isChecked = tempGender === opt.value;
                              return (
                                <label
                                  key={opt.value}
                                  className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer font-medium select-none"
                                >
                                  <input
                                    type="radio"
                                    name="gender"
                                    value={opt.value}
                                    checked={isChecked}
                                    onChange={() => setTempGender(opt.value)}
                                    className="sr-only"
                                  />
                                  <div
                                    className={cn(
                                      "w-5 h-5 rounded-full border flex items-center justify-center transition",
                                      isChecked
                                        ? "border-[#FF6B00] border-2"
                                        : "border-neutral-300"
                                    )}
                                  >
                                    {isChecked && (
                                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                                    )}
                                  </div>
                                  <span>{opt.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Đánh giá */}
                        <div className="space-y-3">
                          <span className="block text-sm font-bold text-neutral-800">Đánh giá</span>
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { label: "Từ 3 sao", value: 3 },
                              { label: "Từ 4 sao", value: 4 },
                              { label: "5 sao", value: 5 },
                              { label: "Tất cả", value: null }
                            ].map((opt) => {
                              const isSelected = tempRating === opt.value;
                              return (
                                <button
                                  key={opt.label}
                                  type="button"
                                  onClick={() => setTempRating(opt.value)}
                                  className={cn(
                                    "flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer select-none",
                                    isSelected
                                      ? "bg-[#FFF0E5] border-[#FF6B00] text-[#FF6B00]"
                                      : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                                  )}
                                >
                                  {opt.value !== null && (
                                    <Star className={cn("h-3.5 w-3.5", isSelected ? "fill-amber-400 text-amber-400" : "fill-neutral-400 text-neutral-400")} />
                                  )}
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Chuyên môn */}
                        <div className="space-y-3">
                          <span className="block text-sm font-bold text-neutral-800">Chuyên môn</span>
                          <div className="grid grid-cols-2 gap-3">
                            {["Gym tổng hợp", "Tăng cơ", "Giảm cân", "Cardio"].map((cat) => {
                              const isChecked = tempCategories.includes(cat);
                              return (
                                <label
                                  key={cat}
                                  className="flex items-center justify-between bg-white border border-neutral-200 p-2.5 rounded-lg text-xs text-neutral-700 cursor-pointer font-medium hover:border-neutral-300 transition select-none"
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {
                                        setTempCategories((prev) =>
                                          prev.includes(cat)
                                            ? prev.filter((c) => c !== cat)
                                            : [...prev, cat]
                                        );
                                      }}
                                      className="sr-only"
                                    />
                                    <div
                                      className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center transition",
                                        isChecked
                                          ? "border-[#FF6B00] bg-[#FF6B00]/10"
                                          : "border-neutral-300"
                                      )}
                                    >
                                      {isChecked && (
                                        <Check className="h-3 w-3 text-[#FF6B00] stroke-[3]" />
                                      )}
                                    </div>
                                    <span>{cat}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-neutral-100 pt-4 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setTempGender("Tất cả giới tính");
                              setTempRating(null);
                              setTempCategories([]);
                            }}
                            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition"
                          >
                            Đặt lại
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGender(tempGender);
                              setSelectedRating(tempRating);
                              setSelectedCategories(tempCategories);
                              setCurrentPage(1);
                              setIsFilterDropdownOpen(false);
                            }}
                            className="bg-[#FF6B00] hover:bg-[#CC5500] text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition"
                          >
                            Áp dụng
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[320px] md:min-w-[480px] flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-[#FF6B00]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm huấn luyện viên theo tên, chuyên môn...."
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-850 placeholder-neutral-400 outline-none transition focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] shadow-2xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

              </div>
            </div>

            {/* Trainer Cards Grid */}
            {filteredTrainers.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 px-6 text-center shadow-sm">
                <svg width="160" height="110" viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6 animate-in fade-in zoom-in-95 duration-300">
                  {/* Clipboard / Document (Background) */}
                  <rect x="76" y="10" width="56" height="76" rx="8" stroke="#FF6B00" strokeWidth="2" fill="#FFFFFF" />
                  {/* Top tab of Clipboard */}
                  <path d="M84 10h40v6a6 6 0 01-6 6H90a6 6 0 01-6-6v-6z" fill="#FFF0E5" stroke="#FF6B00" strokeWidth="2" />
                  {/* Document lines */}
                  <line x1="90" y1="34" x2="118" y2="34" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
                  <line x1="90" y1="46" x2="110" y2="46" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
                  <line x1="90" y1="58" x2="114" y2="58" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />

                  {/* ID Card (Front Left) */}
                  <rect x="42" y="44" width="52" height="34" rx="4" stroke="#FF6B00" strokeWidth="2" fill="#FFFFFF" />
                  {/* ID Card Photo Box */}
                  <rect x="48" y="50" width="14" height="22" rx="2" stroke="#FF6B00" strokeWidth="2" fill="#FFF0E5" />
                  {/* ID Card Lines */}
                  <line x1="68" y1="54" x2="86" y2="54" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
                  <line x1="68" y1="62" x2="80" y2="62" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
                  {/* ID Card Dots */}
                  <circle cx="72" cy="70" r="1.5" fill="#FF6B00" />
                  <circle cx="77" cy="70" r="1.5" fill="#FF6B00" />
                  <circle cx="82" cy="70" r="1.5" fill="#FF6B00" />

                  {/* Pencil (Front Right) */}
                  <path d="M125 36h6v38h-6z" stroke="#FF6B00" strokeWidth="2" fill="#FFFFFF" />
                  <path d="M125 74l3 8 3-8z" stroke="#FF6B00" strokeWidth="2" fill="#FFF0E5" />
                  {/* Eraser */}
                  <path d="M125 36v-3a3 3 0 016 0v3z" fill="#FF6B00" />

                  {/* Decorative Plus Signs */}
                  {/* Big Plus */}
                  <path d="M54 22h8M58 18v8" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
                  {/* Small Plus */}
                  <path d="M68 34h4M70 32v4" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-neutral-600 font-medium text-sm max-w-md leading-relaxed">
                  Không có huấn luyện viên nào đáp ứng tiêu chí lọc. Vui lòng chọn lại bộ lọc
                </p>
                <button
                  onClick={() => {
                    setSelectedGender("Tất cả giới tính");
                    setSelectedRating(null);
                    setSelectedCategories([]);
                    setSearchQuery("");
                  }}
                  className="mt-6 rounded-xl bg-[#FF6B00] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#CC5500] shadow-md shadow-[#FF6B00]/10 cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedTrainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div>
                      {/* Top avatar row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="relative h-14 w-14 overflow-hidden rounded-full border border-neutral-200 shadow-sm">
                            <Image
                              src={trainer.avatar}
                              alt={trainer.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-neutral-800 text-base hover:text-[#FF6B00] cursor-pointer" onClick={() => handleOpenDetailDrawer(trainer)}>
                              {trainer.name}
                            </h3>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {trainer.gender} - {trainer.experience} năm kinh nghiệm
                            </p>
                          </div>
                        </div>

                        {/* Specialization Pill */}
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600 border border-neutral-200/50 font-medium">
                          {trainer.category}
                        </span>
                      </div>

                      {/* Rating section */}
                      <div className="mt-4 flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-neutral-800">{trainer.rating}</span>
                        <span className="h-1 w-1 rounded-full bg-neutral-300 mx-1" />
                        <span className="text-xs text-neutral-505">{trainer.reviewsCount} ca trống hôm nay</span>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div>
                        <span className="text-lg font-extrabold text-neutral-900">
                          {formatMoney(trainer.price)}
                        </span>
                        <span className="text-xs text-neutral-505">/giờ</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenDetailDrawer(trainer)}
                          className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          onClick={() => handleTrainerSelect(trainer)}
                          className="rounded-xl bg-[#FF6B00] px-6 py-2 text-xs font-bold text-white transition hover:bg-[#CC5500] min-w-[80px]"
                        >
                          Chọn
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Pagination Footer */}
            {filteredTrainers.length > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-6">
                
                {/* Page Size Select */}
                <div className="flex items-center gap-2 text-sm text-neutral-450">
                  <span>Hiển thị</span>
                  <div className="relative">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="appearance-none rounded-lg border border-white/10 bg-neutral-900 py-1.5 pl-3 pr-8 text-xs text-white outline-none focus:border-[#FF6B00]"
                    >
                      <option value={6}>06</option>
                      <option value={9}>09</option>
                      <option value={12}>12</option>
                      <option value={15}>15</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 pointer-events-none text-neutral-450" />
                  </div>
                  <span>trong tổng {filteredTrainers.length} huấn luyện viên</span>
                </div>

                {/* Page Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="flex h-9 items-center gap-1 rounded-xl border border-white/10 bg-transparent px-3 text-xs font-semibold text-white transition hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    &lt; Trước
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "h-9 w-9 rounded-xl text-xs font-bold transition",
                          currentPage === pageNum
                            ? "bg-[#FF6B00] text-white"
                            : "border border-white/10 text-neutral-300 hover:bg-white/5"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="flex h-9 items-center gap-1 rounded-xl border border-white/10 bg-transparent px-3 text-xs font-semibold text-white transition hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    Tiếp &gt;
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* STEP 2: BOOKING FORM */}
        {step === "form" && selectedTrainer && (
          <div className="space-y-6">
            
            {/* Row 1: Left column has Trainer Info + Scheduling, Right column has Invoice Summary */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
              
              {/* Left Column (Inputs) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Trainer Info Row */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="h-4 w-1 rounded-full bg-[#FF6B00] mr-2.5" />
                    <h3 className="text-sm font-bold text-neutral-850">Thông tin huấn luyện viên đã chọn</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-neutral-200 shadow-sm">
                        <Image
                          src={selectedTrainer.avatar}
                          alt={selectedTrainer.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-neutral-850">{selectedTrainer.name}</h4>
                        <p className="text-sm text-neutral-505 mt-0.5">
                          {selectedTrainer.category} - {selectedTrainer.experience} năm kinh nghiệm
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:border-l sm:border-neutral-100 sm:pl-6">
                      <div>
                        <p className="text-xs text-neutral-550">Giá buổi tập</p>
                        <p className="text-lg font-extrabold text-neutral-900 mt-0.5">
                          {formatMoney(selectedTrainer.price)}
                          <span className="text-xs font-normal text-neutral-505">/giờ</span>
                        </p>
                      </div>
                      <button
                        onClick={() => setStep("list")}
                        className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-bold text-neutral-705 transition hover:bg-neutral-100"
                      >
                        Đổi HLV
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scheduling Details Card */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-6 space-y-6 shadow-sm flex-1">
                  <div className="flex items-center">
                    <div className="h-4 w-1 rounded-full bg-[#FF6B00] mr-2.5" />
                    <h3 className="text-sm font-bold text-neutral-855">Thời gian</h3>
                  </div>
                  
                  {/* Inputs Row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    
                    {/* Date select */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-700">
                        Ngày tập <span className="text-[#FF6B00]">*</span>
                        <span className="text-[10px] text-neutral-450 font-normal ml-1">(Vui lòng chọn ngày bắt đầu từ hôm nay)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          min="2026-05-01"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-sm text-[#3C3C3C] placeholder-neutral-400 outline-none transition focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Duration Select */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-700">
                        Thời lượng buổi tập <span className="text-[#FF6B00]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={bookingDuration}
                          onChange={(e) => setBookingDuration(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-sm text-neutral-800 outline-none transition focus:border-[#FF6B00] focus:bg-white"
                        >
                          <option value="1 giờ">1 giờ</option>
                          <option value="1.5 giờ">1.5 giờ</option>
                          <option value="2 giờ">2 giờ</option>
                          <option value="2.5 giờ">2.5 giờ</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-neutral-455 pointer-events-none" />
                      </div>
                    </div>

                  </div>

                  {/* Hour slots selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-neutral-700">
                        Giờ bắt đầu <span className="text-[#FF6B00]">*</span>
                        <span className="text-[10px] text-neutral-450 font-normal ml-1">(Nên tập tối đa 2 buổi/ngày để cơ thể phục hồi tốt nhất)</span>
                      </label>
                      <span className="text-[11px] text-[#FF6B00] bg-[#FFF0E5] px-2 py-0.5 rounded border border-[#FF6B00]/10 font-semibold">
                        Còn 08 khung giờ
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedTimeSlot === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={cn(
                              "relative flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition border",
                              !slot.available
                                ? "border-neutral-100 bg-neutral-105 text-[#8E8E8E] cursor-not-allowed"
                                : isSelected
                                ? "border-[#FF6B00] bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/25"
                                : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100"
                            )}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>

                    {/* Color legends */}
                    <div className="flex items-center gap-4 pt-2 text-[11px] text-neutral-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded border border-neutral-200 bg-neutral-50" />
                        <span>Còn trống</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded bg-[#FF6B00]" />
                        <span>Đang chọn</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded bg-[#EDEDED] border border-[#EDEDED]" />
                        <span>Đã đặt</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column (Invoice Summary Card) */}
              <div className="lg:col-span-1">
                <div className="h-full rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between text-neutral-850">
                  
                  {/* Top content */}
                  <div className="space-y-6">
                    <div className="flex items-center pb-3 border-b border-neutral-100">
                      <div className="h-4 w-1 rounded-full bg-[#FF6B00] mr-2.5" />
                      <h3 className="text-base font-bold text-neutral-900">Thông tin hóa đơn</h3>
                    </div>

                    <div className="space-y-3.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-550">Huấn luyện viên</span>
                        <span className="font-semibold text-neutral-800">{selectedTrainer.name}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-neutral-550">Ngày tập</span>
                        <span className="font-semibold text-neutral-800">
                          {bookingDate ? bookingDate.split("-").reverse().join("/") : "--/--/----"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-neutral-555">Khung giờ</span>
                        <span className="font-semibold text-neutral-800">
                          {selectedTimeSlot ? selectedTimeSlot : "--:--"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-neutral-550">Thời lượng</span>
                        <span className="font-semibold text-neutral-800">{bookingDuration}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-neutral-550">Giờ kết thúc</span>
                        <span className="font-semibold text-neutral-800">{endTime}</span>
                      </div>
                    </div>

                    {/* Fees Breakdown */}
                    <div className="pt-4 border-t border-dashed border-neutral-200 space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Chi phí huấn luyện</h4>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-550">Giá buổi tập ({bookingDuration})</span>
                        <span className="font-medium text-[#222222]">{formatMoney(billSummary.durationCost)}</span>
                      </div>

                      {selectedServices.map((serviceId) => {
                        const srv = SERVICES_OPTIONS.find((s) => s.id === serviceId);
                        if (!srv) return null;
                        return (
                          <div key={serviceId} className="flex justify-between text-sm">
                            <span className="text-neutral-555">{srv.name}</span>
                            <span className="font-medium text-[#FF6B00]">+{formatMoney(srv.price)}</span>
                          </div>
                        );
                      })}

                      {billSummary.discount > 0 && (
                        <div className="flex justify-between text-sm bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                          <span className="text-emerald-600 font-medium">Khuyến mãi Combo (Giảm 10%)</span>
                          <span className="font-bold text-emerald-600">-{formatMoney(billSummary.discount)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="pt-4 border-t border-dashed border-[#E5E5E5] space-y-4">
                    {/* Total summary */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#222222]">Tổng cộng</span>
                      <span className={cn(
                        "text-xl font-extrabold",
                        selectedTimeSlot ? "text-[#FF6B00]" : "text-[#222222]"
                      )}>
                        {selectedTimeSlot ? formatMoney(billSummary.total) : "—"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setStep("list")}
                        className="col-span-1 rounded-xl border border-[#D5D5D5] bg-neutral-50 py-3 text-sm font-bold text-neutral-705 transition hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        Quay lại
                      </button>
                      <button
                        type="button"
                        disabled={!selectedTimeSlot}
                        onClick={() => setIsConfirmModalOpen(true)}
                        className="col-span-2 rounded-xl bg-[#FF6B00] py-3 text-sm font-bold text-white transition hover:bg-[#CC5500] disabled:opacity-40 disabled:hover:bg-[#FF6B00] disabled:cursor-not-allowed text-center shadow-lg shadow-[#FF6B00]/10"
                      >
                        Đặt lịch
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Row 2: Service Selection (Below) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Extra services selection */}
              <div className="lg:col-span-2 rounded-2xl border border-neutral-100 bg-white p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <div className="h-4 w-1 rounded-full bg-[#FF6B00] mr-2.5" />
                    <h3 className="text-sm font-bold text-[#222222]">Dịch vụ</h3>
                  </div>
                  <span className="text-[11px] text-[#FF6B00] bg-[#FFF0E5] px-2 py-0.5 rounded border border-[#FF6B00]/10 font-semibold w-fit">
                    Chọn từ 02 dịch vụ trở lên để được giảm 10% tổng hóa đơn
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {SERVICES_OPTIONS.map((srv) => {
                    const isChecked = selectedServices.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleService(srv.id)}
                        className={cn(
                          "group flex cursor-pointer items-start justify-between rounded-xl border transition duration-200 p-4",
                          isChecked
                            ? "border-[#FF6B00] bg-[#FFF0E5]/50 shadow-xs"
                            : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100/50 hover:border-neutral-300"
                        )}
                      >
                        <div className="space-y-1">
                          <h4 className={cn(
                            "text-sm font-bold transition",
                            isChecked ? "text-neutral-900" : "text-neutral-800"
                          )}>
                            {srv.name}
                          </h4>
                          <p className="text-xs text-neutral-505 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>

                        <div className="flex flex-col items-end justify-between h-full min-h-[48px] pl-3 shrink-0">
                          {/* Checkbox circle indicator */}
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border transition",
                              isChecked
                                ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                                : "border-neutral-300 bg-white"
                            )}
                          >
                            {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-extrabold text-[#FF6B00] mt-auto">
                            +{formatMoney(srv.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* DRAWER: TRAINER DETAIL MODAL-DRAWER SLIDING IN FROM RIGHT */}
        {isDetailDrawerOpen && selectedTrainer && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop overlay with fade */}
            <div
              onClick={() => setIsDetailDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 transition-opacity backdrop-blur-xs"
            />

            <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
              <div className="w-screen max-w-md h-full flex flex-col border-l border-neutral-200 bg-white text-neutral-800 shadow-2xl transition duration-300 animate-in slide-in-from-right">
                
                {/* Header */}
                <div className="flex-none flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                  <h2 className="text-base font-bold text-neutral-900">Thông tin huấn luyện viên</h2>
                  <button
                    onClick={() => setIsDetailDrawerOpen(false)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-105 hover:text-neutral-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  
                  {/* Photo Profile Cover Banner */}
                  <div className="relative h-60 w-full overflow-hidden rounded-2xl border border-neutral-100">
                    <Image
                      src={selectedTrainer.avatar}
                      alt={selectedTrainer.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    {/* Floating Profile Info (Overlaid on dark image - keep text white) */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{selectedTrainer.name}</h3>
                      <p className="text-xs text-neutral-200 mt-0.5">
                        {selectedTrainer.gender} - {selectedTrainer.experience} năm kinh nghiệm
                      </p>
                    </div>
                  </div>

                  {/* Summary Metric Badges Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-center">
                      <p className="text-lg font-bold text-[#FF6B00]">{selectedTrainer.rating}</p>
                      <p className="text-[9px] uppercase tracking-wider text-neutral-450 mt-1 font-semibold">Đánh giá</p>
                    </div>
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-center">
                      <p className="text-lg font-bold text-[#FF6B00]">{selectedTrainer.reviewsCount}</p>
                      <p className="text-[9px] uppercase tracking-wider text-neutral-455 mt-1 font-semibold">Ca trống</p>
                    </div>
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-center">
                      <p className="text-lg font-bold text-[#FF6B00]">{selectedTrainer.experience} năm</p>
                      <p className="text-[9px] uppercase tracking-wider text-neutral-455 mt-1 font-semibold">Kinh nghiệm</p>
                    </div>
                  </div>

                  {/* Specialty services tags */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-450">Dịch vụ huấn luyện</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrainer.services.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio Description */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-450">Giới thiệu</h4>
                    <p className="text-sm text-neutral-650 leading-relaxed font-light">
                      {selectedTrainer.bio}
                    </p>
                  </div>

                  {/* Member feedback */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-450">Đánh giá từ hội viên</h4>
                      <span className="text-xs text-neutral-455">{selectedTrainer.reviews.length} nhận xét</span>
                    </div>

                    <div className="space-y-2.5">
                      {selectedTrainer.reviews.map((rev, idx) => (
                        <div key={idx} className="rounded-xl border border-neutral-100 bg-neutral-50 p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-850">{rev.author}</span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, sIdx) => (
                                <Star
                                  key={sIdx}
                                  className={cn(
                                    "h-3 w-3",
                                    sIdx < Math.floor(rev.rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-neutral-300"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-neutral-500 leading-relaxed italic font-light">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer action bottom block */}
                <div className="flex-none border-t border-neutral-100 bg-white p-6 space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">Giá dịch vụ</p>
                      <p className="text-xl font-extrabold text-neutral-900 mt-0.5">
                        {formatMoney(selectedTrainer.price)}
                        <span className="text-xs font-normal text-neutral-500">/ giờ</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsDetailDrawerOpen(false);
                      handleTrainerSelect(selectedTrainer);
                    }}
                    className="w-full rounded-xl bg-[#FF6B00] py-3 text-sm font-bold text-white transition hover:bg-[#CC5500] shadow-lg shadow-[#FF6B00]/10"
                  >
                    Đặt lịch với huấn luyện viên này
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRM BOOKING */}
        {isConfirmModalOpen && selectedTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              onClick={() => setIsConfirmModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <div className="relative w-full max-w-md transform rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-800 shadow-2xl transition duration-355 animate-in zoom-in-95">
              
              {/* Close Button */}
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-105 hover:text-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title & icon */}
              <div className="space-y-1 pr-6">
                <h3 className="text-lg font-bold text-neutral-900">Xác nhận đặt lịch</h3>
                <p className="text-xs text-neutral-500">Kiểm tra lại thông tin trước khi hoàn tất đăng ký</p>
              </div>

              {/* Booking Summary Box */}
              <div className="mt-5 space-y-3 text-sm border border-neutral-100 rounded-xl bg-neutral-50 p-4">
                <div className="flex justify-between">
                  <span className="text-neutral-550">Huấn luyện viên</span>
                  <span className="font-bold text-neutral-800">{selectedTrainer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-550">Ngày tập</span>
                  <span className="font-semibold text-neutral-800">
                    {bookingDate ? bookingDate.split("-").reverse().join("/") : "--/--/----"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-550">Khung giờ</span>
                  <span className="font-semibold text-neutral-800">{selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-550">Thời lượng</span>
                  <span className="font-semibold text-neutral-800">{bookingDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-550">Giờ kết thúc</span>
                  <span className="font-semibold text-neutral-800">{endTime}</span>
                </div>
              </div>

              {/* Total Pay details */}
              <div className="mt-5 pt-4 border-t border-dashed border-neutral-100 flex items-center justify-between">
                <span className="text-sm text-neutral-500">Tổng thanh toán</span>
                <span className="text-xl font-extrabold text-[#FF6B00]">
                  {formatMoney(billSummary.total)}
                </span>
              </div>

              {/* Footer action buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-105"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  className="rounded-xl bg-[#FF6B00] py-2.5 text-sm font-bold text-white transition hover:bg-[#CC5500] shadow-md shadow-[#FF6B00]/10"
                >
                  Xác nhận
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MODAL: SUCCESS BOOKING */}
        {isSuccessModalOpen && selectedTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Box */}
            <div className="relative w-full max-w-sm transform rounded-3xl border border-neutral-200 bg-white p-6 text-center text-neutral-850 shadow-2xl transition duration-300 animate-in zoom-in-95">
              
              {/* Checkmark circle animated */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/15 animate-bounce">
                <Check className="h-9 w-9 stroke-[3]" />
              </div>

              {/* Message */}
              <h3 className="mt-6 text-xl font-bold text-neutral-900">Đăng ký thành công!</h3>
              <p className="mt-2 text-sm text-neutral-500 leading-relaxed font-light">
                Chúc mừng bạn đã đặt lịch tập thành công với huấn luyện viên{" "}
                <span className="font-bold text-neutral-800">{selectedTrainer.name}</span> vào lúc{" "}
                <span className="font-semibold text-neutral-800">{selectedTimeSlot}</span> ngày{" "}
                <span className="font-semibold text-neutral-800">
                  {bookingDate ? bookingDate.split("-").reverse().join("/") : "--/--/----"}
                </span>
                .
              </p>

              {/* Summary line */}
              <div className="mt-5 rounded-2xl bg-neutral-50 border border-neutral-100 p-3 flex justify-between text-xs text-neutral-600">
                <span>Mã số hóa đơn:</span>
                <span className="font-mono text-neutral-850">GMX-PT-{(Math.floor(Math.random() * 90000) + 10000)}</span>
              </div>

              {/* Navigation button */}
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    router.push("/history");
                  }}
                  className="w-full rounded-xl bg-[#FF6B00] py-3 text-sm font-bold text-white transition hover:bg-[#CC5500] shadow-md shadow-[#FF6B00]/10"
                >
                  Xem lịch sử tập
                </button>
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    setStep("list");
                    setSelectedTrainer(null);
                  }}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
                >
                  Trở lại danh sách HLV
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </HomeLayout>
  );
}
