"use client";

import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { HomeLayout } from "@/components/home-layout";
import { useRouter } from "next/navigation";
import {
  Search,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ChevronDown,
  SlidersHorizontal,
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
   avatar: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=150&q=80",
    services: ["Kickboxing", "Kỹ thuật đấm nâng cao", "Thể lực võ sĩ"],
    bio: "Cựu vận động viên boxing quốc gia. Hướng dẫn trực tiếp các kỹ thuật thi đấu chuẩn xác và rèn luyện tinh thần thép.",
    reviewsCount: 12,
    reviews: [
      { author: "Hội viên Kiên", rating: 5, comment: "Kỹ năng thực chiến của thầy Thịnh đẳng cấp thế giới." }
    ]
  }
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
    name: "Gói cơ bản",
    price: 150000,
    description: "Lộ trình tập cá nhân hóa."
  },
  {
    id: "chuyen_sau",
    name: "Gói chuyên sâu",
    price: 320000,
    description: "Lộ trình tập + Dinh dưỡng + Kiểm tra sức khỏe + Theo dõi tuần."
  }
];

const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const toDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateDisplay = (dateValue: string) =>
  dateValue ? dateValue.split("-").reverse().join("/") : "--/--/----";

const formatMonthLabel = (date: Date) =>
  `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;

const getCalendarDays = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  return Array.from({ length: startOffset + daysInMonth }, (_, index) => {
    if (index < startOffset) return null;
    return new Date(year, month, index - startOffset + 1);
  });
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

export default function RegisterPTPage() {
  const router = useRouter();

  // Navigation / Flow states
  const [step, setStep] = useState<"list" | "form">("list");
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Drawer / Modal states
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successInvoiceCode, setSuccessInvoiceCode] = useState("");

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


  // 1. Khai báo ref để định vị hộp thoại bộ lọc
const filterDropdownRef = React.useRef<HTMLDivElement>(null);

// 2. Lắng nghe sự kiện click toàn cục
React.useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    // Nếu hộp thoại đang mở và vị trí click nằm NGOÀI hộp thoại
    if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
      
      // Kiểm tra tránh xung đột nếu user click trúng nút "Lọc" chính để mở panel
      const target = event.target as HTMLElement;
      if (!target.closest("button")?.innerHTML.includes("Lọc")) {
        setIsFilterDropdownOpen(false);
      }
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [setIsFilterDropdownOpen]);
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

  // Calendar states
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2026, 4, 28));
  const calendarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
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
  // Filter trainers
  const filteredTrainers = useMemo(() => {
    return MOCK_TRAINERS.filter((t) => {
      // 1. Lọc theo thanh tìm kiếm (Không phân biệt hoa thường)
      const matchSearch =
        searchQuery.trim() === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Lọc theo giới tính
      const matchGender =
        selectedGender === "Tất cả giới tính" || t.gender === selectedGender;

      // 3. Lọc theo số sao đánh giá
      const matchRating =
        selectedRating === null || t.rating >= selectedRating;

      // 4. Lọc theo chuyên môn thông minh (Sửa lỗi mất HLV ở đây)
      const matchSpecialty =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) => {
          const categoryLower = t.category?.toLowerCase() || "";
          const servicesLower = t.services?.map(s => s.toLowerCase()) || [];

          switch (cat) {
            case "Gym tổng hợp":
              return categoryLower.includes("gym") || categoryLower.includes("thể hình");

            case "Tăng cơ":
              return categoryLower.includes("gym") || servicesLower.some(s => s.includes("tăng cơ") || s.includes("cơ bắp") || s.includes("phát triển cơ"));

            case "Giảm cân":
              return categoryLower.includes("giảm") || servicesLower.some(s => s.includes("giảm cân") || s.includes("giảm mỡ") || s.includes("đốt mỡ") || s.includes("giảm béo"));

            case "Cardio":
              return categoryLower.includes("cardio") || categoryLower.includes("aerobic") || 
                     servicesLower.some(s => s.includes("cardio") || s.includes("aerobic"));

            case "Yoga":
              return categoryLower.includes("yoga") || servicesLower.some(s => s.includes("yoga"));

            case "Pilates":
              return categoryLower.includes("pilates") || servicesLower.some(s => s.includes("pilates"));

            case "Boxing":
              return categoryLower.includes("boxing") || categoryLower.includes("võ") || 
                     servicesLower.some(s => s.includes("boxing") || s.includes("kickboxing") || s.includes("đối kháng"));

            case "Phục hồi":
              return categoryLower.includes("phục hồi") || categoryLower.includes("trị liệu") || 
                     servicesLower.some(s => s.includes("phục hồi") || s.includes("trị liệu") || s.includes("xương khớp"));

            case "Calisthenics":
              return categoryLower.includes("calisthenics") || 
                     servicesLower.some(s => s.includes("calisthenics") || s.includes("bodyweight"));

            case "Powerlifting":
              return categoryLower.includes("powerlifting") || 
                     servicesLower.some(s => s.includes("powerlifting") || s.includes("tạ nặng"));

            default:
              const catLower = cat.toLowerCase();
              return categoryLower.includes(catLower) || servicesLower.some(s => s.includes(catLower));
          }
        });

      return matchSearch && matchGender && matchRating && matchSpecialty;
    }).sort((a, b) => b.rating - a.rating);
  }, [searchQuery, selectedGender, selectedRating, selectedCategories]);


  // Paginated trainers
  const paginatedTrainers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTrainers.slice(startIndex, startIndex + pageSize);
  }, [filteredTrainers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTrainers.length / pageSize) || 1;
  const visiblePages = getVisiblePages(currentPage, totalPages);

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
    /* let discount = 0;
    if (selectedServices.length >= 2) {
      discount = subtotal * 0.1; // 10% discount
    } */

    const total = subtotal //- discount;

    return {
      durationCost,
      servicesCost,
      //discount,
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
    // Ép mảng chỉ giữ duy nhất một gói được chọn thay vì thêm/bớt nhiều gói như cũ
    setSelectedServices([serviceId]);
  };

  const handleBookingSubmit = () => {
    if (!selectedTrainer) return;

    const selectedAddons = selectedServices
      .map((serviceId) => SERVICES_OPTIONS.find((service) => service.id === serviceId))
      .filter((service): service is (typeof SERVICES_OPTIONS)[number] => Boolean(service))
      .map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
      }));

    const checkout = {
      id: `INV-PT-${Date.now()}`,
      source: "pt",
      packageId: selectedTrainer.id,
      packageName: `Lịch tập với ${selectedTrainer.name}`,
      duration: bookingDuration,
      durationLabel: bookingDuration,
      startDate: bookingDate,
      trainerName: selectedTrainer.name,
      timeSlot: selectedTimeSlot ?? "--",
      endTime,
      selectedAddons,
      amount: billSummary.total,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("gym_pending_payment", JSON.stringify(checkout));
    setIsConfirmModalOpen(false);
    router.push("/payment");
  };

  // Format money helper
  const formatMoney = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  return (
    <HomeLayout
      pageTitle="Đăng ký lịch tập với HLV"
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
      {mounted && showCancelAlert && createPortal(
        <div className="fixed left-1/2 top-5 z-55 flex w-[360px] -translate-x-1/2 items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-xl border border-red-100 font-sans animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-xs">
            <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[#EF4444]">
              <X className="h-2.5 w-2.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-sm font-normal text-neutral-800">
            Thanh toán đã bị hủy
          </span>
          <button
            onClick={() => setShowCancelAlert(false)}
            className="ml-auto text-neutral-400 hover:text-neutral-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>,
        document.body
      )}

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
  /* NỚI RỘNG TỐI ĐA: Tăng lên w-[480px] giúp các nút thoải mái không gian, không bị dính sát */
  <div 
    ref={filterDropdownRef}
    className="absolute left-0 mt-2 z-35 w-[480px] rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl text-neutral-800 animate-in fade-in-50 zoom-in-95 duration-150"
  >
    <div className="space-y-5">
      
      {/* Title with left orange line */}
      <div className="flex items-center mb-1">
        <div className="h-5 w-1 rounded-full bg-[#FF6B00] mr-2.5" />
        <span className="text-base font-bold text-neutral-900">Bộ lọc huấn luyện viên</span>
      </div>

      {/* Giới tính */}
      <div className="space-y-3">
        <span className="block text-sm font-bold text-neutral-800">Giới tính</span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Nam", value: "Nam" },
            { label: "Nữ", value: "Nữ" },
            { label: "Tất cả", value: "Tất cả giới tính" }
          ].map((opt) => {
            const isChecked = tempGender === opt.value;
            return (
              <label
                key={opt.value}
                className={cn(
                  /* SỬA TẠI ĐÂY: Thay justify-center bằng justify-start và thêm px-3 để căn lề trái */
                  "flex items-center justify-start gap-2.5 h-9 rounded-lg text-xs font-bold border transition cursor-pointer select-none px-3",
                  isChecked
                    ? "bg-[#FFF0E5] border-[#FF6B00] text-[#FF6B00]"
                    : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                )}
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
                    "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition",
                    isChecked ? "border-[#FF6B00] border-2" : "border-neutral-300"
                  )}
                >
                  {isChecked && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
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
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Từ 3 sao", value: 3 },
            { label: "Từ 4 sao", value: 4 },
            { label: "5 sao", value: 5 },
            { label: "Tất cả", value: null }
          ].map((opt) => {
            const isChecked = tempRating === opt.value;
            return (
              <label
                key={opt.label}
                className={cn(
                  /* SỬA TẠI ĐÂY: Thay justify-center bằng justify-start kèm px-2.5 để đẩy toàn bộ nội dung sang trái */
                  "flex items-center justify-start flex-nowrap whitespace-nowrap gap-1.5 h-9 rounded-lg text-[11px] font-bold border transition cursor-pointer select-none px-2.5",
                  isChecked
                    ? "bg-[#FFF0E5] border-[#FF6B00] text-[#FF6B00]"
                    : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <input
                  type="radio"
                  name="rating"
                  value={opt.value ?? "all"}
                  checked={isChecked}
                  onChange={() => setTempRating(opt.value)}
                  className="sr-only"
                />
                
                {/* Vòng tròn Radio */}
                <div
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition",
                    isChecked ? "border-[#FF6B00] border-2" : "border-neutral-300"
                  )}
                >
                  {isChecked && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                  )}
                </div>

                {opt.value !== null && (
                  <Star className={cn("h-3 w-3 shrink-0 ml-0.5", isChecked ? "fill-amber-400 text-amber-400" : "fill-neutral-400 text-neutral-400")} />
                )}
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Chuyên môn */}
      <div className="space-y-3">
        <span className="block text-sm font-bold text-neutral-800">Chuyên môn (Chọn một hoặc nhiều)</span>
        <div className="grid grid-cols-2 gap-3">
          <label
            className="flex items-center justify-between bg-white border border-neutral-200 p-2.5 rounded-lg text-xs text-neutral-700 cursor-pointer font-medium hover:border-neutral-300 transition select-none"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tempCategories.length === 0}
                onChange={() => {
                  setTempCategories([]);
                }}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center transition",
                  tempCategories.length === 0
                    ? "border-[#FF6B00] bg-[#FF6B00]"
                    : "border-neutral-300 bg-white"
                )}
              >
                {tempCategories.length === 0 && (
                  <Check className="h-3 w-3 text-white stroke-[3]" />
                )}
              </div>
              <span>Tất cả</span>
            </div>
          </label>

          {["Gym tổng hợp", "Tăng cơ", "Giảm cân", "Cardio", "Yoga", "Pilates","Calisthenics", "Powerlifting","Boxing","Phục hồi"].map((cat) => {
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
                        ? "border-[#FF6B00] bg-[#FF6B00]"
                        : "border-neutral-300 bg-white"
                    )}
                  >
                    {isChecked && (
                      <Check className="h-3 w-3 text-white stroke-[3]" />
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
      <div className="border-t border-neutral-100 pt-4 grid grid-cols-2 gap-3 w-full">
        <button
          type="button"
          onClick={() => {
            setTempGender("Tất cả giới tính");
            setTempRating(null);
            setTempCategories([]);
          }}
          className="flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
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
          className="flex h-10 items-center justify-center rounded-xl bg-[#FF6B00] text-sm font-bold text-white hover:bg-[#E05E00] transition cursor-pointer shadow-xs"
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
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
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
                            <img
                              src={trainer.avatar}
                              alt={trainer.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-neutral-800 text-base hover:text-[#FF6B00] cursor-pointer" onClick={() => handleOpenDetailDrawer(trainer)}>
                              {trainer.name}
                            </h3>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {trainer.gender} · {trainer.experience} năm kinh nghiệm
                            </p>
                          </div>
                        </div>

                        {/* Specialization Pill */}
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600 border border-neutral-200/50 font-medium">
                          {trainer.category}
                        </span>
                      </div>

                      {/* Rating + Price row */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-neutral-800">{trainer.rating}</span>
                        </div>
                        <div>
                          <span className="text-lg font-extrabold text-neutral-900">
                            {formatMoney(trainer.price)}
                          </span>
                          <span className="text-xs text-neutral-500">/giờ</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-5 flex gap-3 pt-4 border-t border-neutral-100">
                      <button
                        onClick={() => handleOpenDetailDrawer(trainer)}
                        className="flex-1 h-10 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900 text-center cursor-pointer"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleTrainerSelect(trainer)}
                        className="flex-1 h-10 rounded-xl bg-[#FF6B00] text-sm font-bold text-white transition hover:bg-[#E05E00] text-center cursor-pointer shadow-sm shadow-[#FF6B00]/30"
                      >
                        Chọn
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Pagination Footer */}
            {filteredTrainers.length > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-6">
                
                {/* Page Size Select */}
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <span>Hiển thị</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[74px] rounded-md border-0 bg-white px-3 py-0 text-xs font-semibold text-neutral-800 shadow-sm [&_svg]:text-[#FF6B00]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-neutral-200 bg-white shadow-xl">
                      <SelectItem value="6">06</SelectItem>
                      <SelectItem value="9">09</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                    </SelectContent>
                  </Select>
                  <span>trong tổng {filteredTrainers.length} huấn luyện viên</span>
                </div>

                 {/* Page Controls */}
                 <div className="flex items-center gap-2">
                   <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     disabled={currentPage === 1}
                     onClick={() => setCurrentPage(currentPage - 1)}
                     className="h-7 rounded-md px-1.5 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
                   >
                     ‹ Trước
                   </Button>
 
                   {visiblePages.map((page, index) => {
                     if (page === "...") {
                       return (
                         <span key={`ellipsis-${index}`} className="px-1 text-[11px] font-semibold text-white/70">
                           ...
                         </span>
                       );
                     }

                     const pageNum = page as number;

                     return (
                       <Button
                         key={pageNum}
                         type="button"
                         variant={currentPage === pageNum ? "default" : "ghost"}
                         size="icon-sm"
                         onClick={() => setCurrentPage(pageNum)}
                         className={cn(
                           "h-7 w-7 rounded-md text-[11px] font-semibold",
                           currentPage === pageNum
                             ? "bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90"
                             : "bg-transparent text-white hover:bg-white/10 hover:text-white"
                         )}
                       >
                         {pageNum}
                       </Button>
                     );
                   })}
 
                   <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     disabled={currentPage === totalPages}
                     onClick={() => setCurrentPage(currentPage + 1)}
                     className="h-7 rounded-md px-1.5 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
                   >
                     Tiếp ›
                   </Button>
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
                        <img
                          src={selectedTrainer.avatar}
                          alt={selectedTrainer.name}
                          className="w-full h-full object-cover"
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
                      <div className="relative" ref={calendarRef}>
                        <button
                          type="button"
                          onClick={() => setIsCalendarOpen((open) => !open)}
                          className="w-full flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-sm text-neutral-800 outline-none hover:bg-neutral-100/50 hover:border-neutral-300 transition cursor-pointer select-none"
                        >
                          <span>{formatDateDisplay(bookingDate)}</span>
                          <Calendar className="h-4 w-4 text-[#FF6B00]" />
                        </button>

                        {isCalendarOpen && (
                          <div className="absolute left-0 top-[calc(100%+8px)] z-60 w-[276px] rounded-lg border border-neutral-200 bg-white p-3 shadow-lg font-sans">
                            {/* Calendar Header */}
                            <div className="relative flex items-center justify-center pt-1.5 pb-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setCalendarMonth(
                                    (month) => new Date(month.getFullYear(), month.getMonth() - 1, 1),
                                  )
                                }
                                className="absolute left-1 flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 bg-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition cursor-pointer"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <span className="text-sm font-medium text-neutral-850">
                                {formatMonthLabel(calendarMonth)}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setCalendarMonth(
                                    (month) => new Date(month.getFullYear(), month.getMonth() + 1, 1),
                                  )
                                }
                                className="absolute right-1 flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 bg-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition cursor-pointer"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Weekdays Row */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                              {WEEK_DAYS.map((day) => (
                                <div key={day} className="h-8 w-8 flex items-center justify-center text-[10px] font-normal text-neutral-400">
                                  {day}
                                </div>
                              ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                              {getCalendarDays(calendarMonth).map((day, index) => {
                                if (!day) {
                                  return <div key={`empty-${index}`} className="h-8 w-8" />;
                                }

                                const dateValue = toDateValue(day);
                                const isSelected = dateValue === bookingDate;
                                const todayDate = new Date();
                                todayDate.setHours(0, 0, 0, 0);
                                const isDisabled = day < todayDate;

                                return (
                                  <button
                                    key={dateValue}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => {
                                      setBookingDate(dateValue);
                                      setCalendarMonth(day);
                                      setIsCalendarOpen(false);
                                    }}
                                    className={cn(
                                      "h-8 w-8 rounded-md text-xs font-normal transition-colors flex items-center justify-center cursor-pointer",
                                      isSelected
                                        ? "bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90 font-medium"
                                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                                      isDisabled && "text-neutral-300 opacity-40 cursor-not-allowed pointer-events-none",
                                    )}
                                  >
                                    {day.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Duration Select */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-700">
                        Thời lượng buổi tập <span className="text-[#FF6B00]">*</span>
                      </label>
                      <Select value={bookingDuration} onValueChange={(val) => setBookingDuration(val || "1 giờ")}>
                        <SelectTrigger className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-100/50 hover:border-neutral-300 transition cursor-pointer select-none">
                          <SelectValue placeholder="Chọn thời lượng" />
                        </SelectTrigger>
                        <SelectContent className="z-55 rounded-lg border border-neutral-border bg-white p-1 shadow-xl">
                          <SelectItem value="1 giờ">1 giờ</SelectItem>
                          <SelectItem value="1.5 giờ">1.5 giờ</SelectItem>
                          <SelectItem value="2 giờ">2 giờ</SelectItem>
                          <SelectItem value="2.5 giờ">2.5 giờ</SelectItem>
                        </SelectContent>
                      </Select>
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
  // Nếu chọn "Không thêm dịch vụ nào" thì ẩn đi, không hiển thị ở hóa đơn
  if (serviceId === "khong") return null;

  const srv = SERVICES_OPTIONS.find((s) => s.id === serviceId);
  if (!srv) return null;
  
  return (
    <div key={serviceId} className="flex justify-between text-sm">
      <span className="text-neutral-600">{srv.name}</span>
      <span className="font-medium text-[#FF6B00]">+{formatMoney(srv.price)}</span>
    </div>
  );
})}
{/* 
                      {billSummary.discount > 0 && (
                        <div className="flex justify-between text-sm bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                          <span className="text-emerald-600 font-medium">Khuyến mãi Combo (Giảm 10%)</span>
                          <span className="font-bold text-emerald-600">-{formatMoney(billSummary.discount)}</span>
                        </div>
                      )} */}
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
                    <div className="mt-6 grid grid-cols-2 gap-3 w-full">
                      <button
                        type="button"
                        onClick={() => setStep("list")}
                        // Đồng bộ hoàn toàn class với nút "Quay lại" của footer
                        className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-bold text-neutral-700 transition hover:bg-neutral-100 flex items-center justify-center cursor-pointer"
                      >
                        Quay lại
                      </button>
                      <button
                        type="button"
                        disabled={!selectedTimeSlot}
                        onClick={() => setIsConfirmModalOpen(true)}
                        // Đồng bộ h-11, màu cam, đổ bóng, bổ sung các thuộc tính disabled để mượt mà khi chưa chọn ca
                        className="w-full h-11 rounded-xl bg-[#FF6B00] text-sm font-bold text-white transition hover:bg-[#CC5500] shadow-md shadow-[#FF6B00]/10 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FF6B00]"
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
                  
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {SERVICES_OPTIONS.map((srv) => {
                    // Cũ là .includes(), giờ chỉ chọn 1 nên so sánh bằng luôn cho chuẩn
                    const isChecked = selectedServices.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleService(srv.id)} // Gọi hàm ép chọn 1
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
                          <p className="text-xs text-neutral-500 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>

                        <div className="flex flex-col items-end justify-between h-full min-h-[48px] pl-3 shrink-0">
                          {/* SỬA TẠI ĐÂY: Biến đổi giao diện từ Checkbox thành vòng tròn Radio */}
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border transition",
                              isChecked
                                ? "border-[#FF6B00] bg-[#FF6B00]"
                                : "border-neutral-300 bg-white"
                            )}
                          >
                            {/* Nếu được chọn, hiển thị một chấm trắng nhỏ ở tâm (Chuẩn UI Radio button) */}
                            {isChecked && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
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
        {mounted && isDetailDrawerOpen && selectedTrainer && createPortal(
          <div className="fixed inset-0 z-55 overflow-hidden">
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
                    <img
                      src={selectedTrainer.avatar}
                      alt={selectedTrainer.name}
                      className="w-full h-full object-cover"
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
                            &quot;{rev.comment}&quot;
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
                      <p className="text-xs text-neutral-505">Giá dịch vụ</p>
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
          </div>,
          document.body
        )}

        {/* MODAL: CONFIRM BOOKING */}
        {mounted && isConfirmModalOpen && selectedTrainer && createPortal(
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
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
                <p className="text-xs text-neutral-505">Kiểm tra lại thông tin trước khi hoàn tất đăng ký</p>
              </div>

              {/* Booking Summary Box (Đổi bg-neutral-50 thành border/padding trực tiếp để các chữ không bị thụt lề vào trong) */}
<div className="mt-5 space-y-4 text-sm">
  
  {/* Nhóm thông tin chi tiết: Đặt chung w-40 shrink-0 cho TẤT CẢ các dòng để thẳng hàng tăm tắp */}
  <div className="flex items-center">
    <span className="text-neutral-750 w-40 shrink-0 text-left font-medium">Huấn luyện viên</span>
    <span className="font-bold text-neutral-800 flex-1 text-right">{selectedTrainer.name}</span>
  </div>
  
  <div className="flex items-center">
    <span className="text-neutral-750 w-40 shrink-0 text-left font-medium">Ngày tập</span>
    <span className="font-semibold text-neutral-800 flex-1 text-right">
      {bookingDate ? bookingDate.split("-").reverse().join("/") : "--/--/----"}
    </span>
  </div>
  
  <div className="flex items-center">
    <span className="text-neutral-750 w-40 shrink-0 text-left font-medium">Khung giờ</span>
    <span className="font-semibold text-neutral-800 flex-1 text-right">{selectedTimeSlot}</span>
  </div>
  
  <div className="flex items-center">
    <span className="text-neutral-750 w-40 shrink-0 text-left font-medium">Thời lượng</span>
    <span className="font-semibold text-neutral-800 flex-1 text-right">{bookingDuration}</span>
  </div>
  
  <div className="flex items-center">
    <span className="text-neutral-750 w-40 shrink-0 text-left font-medium">Giờ kết thúc</span>
    <span className="font-semibold text-neutral-800 flex-1 text-right">{endTime}</span>
  </div>

  {/* Phần giá cả bên dưới (Giữ nguyên khoảng cách dòng space-y-4 và w-40 nên tự động thẳng hàng với cụm trên) */}
  <div className="flex items-center">
    <span className="text-neutral-750 w-40 shrink-0 text-left font-medium">Giá buổi tập ({bookingDuration})</span>
    <span className="font-semibold text-neutral-800 flex-1 text-right">{formatMoney(billSummary.durationCost)}</span>
  </div>

  {selectedServices.map((serviceId) => {
    if (serviceId === "khong") return null;

    const srv = SERVICES_OPTIONS.find((s) => s.id === serviceId);
    if (!srv) return null;
    
    return (
      <div key={serviceId} className="flex items-center">
        <span className="text-neutral-750 w-40 shrink-0 text-left font-medium">{srv.name}</span>
        {/* Đổi text-[#FF6B00] (cam) thành text-neutral-800 (đen) để đồng bộ với giá buổi tập */}
        <span className="font-semibold text-neutral-800 flex-1 text-right">+{formatMoney(srv.price)}</span>
      </div>
    );
  })}
</div>

{/* Total Pay details (Giữ nguyên vị trí cũ không bị ảnh hưởng bởi w-40) */}
<div className="mt-5 pt-4 border-t border-dashed border-neutral-200 flex items-center justify-between">
  <span className="text-sm font-semibold text-neutral-700">Tổng thanh toán</span>
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
          </div>,
          document.body
        )}

        {/* MODAL: SUCCESS BOOKING */}
        {mounted && isSuccessModalOpen && selectedTrainer && createPortal(
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
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
              <p className="mt-2 text-sm text-neutral-505 leading-relaxed font-light">
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
                <span className="font-mono text-neutral-850">{successInvoiceCode}</span>
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
          </div>,
          document.body
        )}

      </div>
    </HomeLayout>
  );
}
