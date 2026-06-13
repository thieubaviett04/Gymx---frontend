// Cơ sở dữ liệu giả lập (Mock Database) cho hệ thống Gym-X
// Lưu trữ trực tiếp trong localStorage của trình duyệt để duy trì trạng thái khi F5.

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'receptionist';
  avatarUrl: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  joinDate: string;
}

export interface Membership {
  id: string;
  userId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'INACTIVE';
  planType: 'Gói 1 Tháng' | 'Gói 3 Tháng' | 'Gói 12 Tháng' | 'Gói VIP';
  startDate: string;
  endDate: string;
  pricePaid: number;
}

export interface PT {
  id: string;
  name: string;
  avatarUrl: string;
  specialty: string;
  rating: number;
  bio: string;
  price: number;
  availableTimes: string[]; // Khung giờ trống ví dụ: ["Thứ 2 - 08:00", "Thứ 2 - 14:00", ...]
}

export interface Booking {
  id: string;
  userId: string;
  ptId: string;
  ptName: string;
  timeSlot: string; // ví dụ: "08:00 - 09:00"
  date: string; // YYYY-MM-DD
  status: 'CONFIRMED' | 'CANCELLED' | 'ATTENDED' | 'MISSED';
  serviceName?: string;
  rating?: number;
  comment?: string;
  ratedAt?: string;
  isEditedRating?: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentDate: string;
  planName: string;
  method: 'QR Code' | 'ATM' | 'Ví Điện Tử' | 'Tiền mặt' | 'Chuyển khoản' | 'Thẻ tín dụng / POS';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface CheckIn {
  id: string;
  userId: string;
  userName: string;
  checkInTime: string;
  checkOutTime: string | null;
}

// Dữ liệu mẫu ban đầu bằng Tiếng Việt
const INITIAL_USERS: User[] = [
  {
    id: "M001",
    name: "Nguyễn Văn An",
    email: "an.nguyen@gmail.com",
    role: "member",
    avatarUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop",
    phone: "0912345678",
    gender: "Nam",
    joinDate: "2026-01-15"
  },
  {
    id: "M002",
    name: "Trần Thị Bình",
    email: "binh.tran@gmail.com",
    role: "member",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    phone: "0987654321",
    gender: "Nữ",
    joinDate: "2026-03-10"
  },
  {
    id: "M003",
    name: "Hoàng Đức Minh",
    email: "minh.hoang@gmail.com",
    role: "member",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    phone: "0934567890",
    gender: "Nam",
    joinDate: "2026-05-20"
  },
  {
    id: "R001",
    name: "Lê Văn Cường",
    email: "cuong.le@gymx.com",
    role: "receptionist",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
    phone: "0909998887",
    gender: "Nam",
    joinDate: "2025-10-01"
  }
];

const INITIAL_MEMBERSHIPS: Membership[] = [
  {
    id: "MS-001",
    userId: "M001",
    status: "ACTIVE",
    planType: "Gói 3 Tháng",
    startDate: "2026-05-01",
    endDate: "2026-08-01",
    pricePaid: 1500000
  },
  {
    id: "MS-002",
    userId: "M002",
    status: "EXPIRED",
    planType: "Gói 1 Tháng",
    startDate: "2026-04-10",
    endDate: "2026-05-10",
    pricePaid: 600000
  },
  {
    id: "MS-003",
    userId: "M003",
    status: "ACTIVE",
    planType: "Gói 12 Tháng",
    startDate: "2026-05-20",
    endDate: "2027-05-20",
    pricePaid: 5000000
  }
];

const INITIAL_PTS: PT[] = [
  {
    id: "PT001",
    name: "Nguyễn Hùng Cường",
    avatarUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=200&auto=format&fit=crop",
    specialty: "Tăng cơ chuyên sâu, Giảm mỡ SIết cơ",
    rating: 4.9,
    price: 300000, // Giá/buổi
    bio: "Hơn 5 năm kinh nghiệm huấn luyện thể hình chuyên nghiệp. Đã giúp hơn 200 học viên thay đổi thể hình thành công.",
    availableTimes: [
      "Thứ 2 - 08:00", "Thứ 2 - 10:00", "Thứ 2 - 14:00",
      "Thứ 4 - 08:00", "Thứ 4 - 15:00", "Thứ 4 - 19:00",
      "Thứ 6 - 10:00", "Thứ 6 - 14:00", "Thứ 6 - 20:00"
    ]
  },
  {
    id: "PT002",
    name: "Trần Thị Lan Anh",
    avatarUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=200&auto=format&fit=crop",
    specialty: "Yoga bay, Pilates, Điều chỉnh tư thế",
    rating: 4.8,
    price: 350000,
    bio: "Chứng chỉ Yoga quốc tế Alliance 500 giờ. Chuyên sâu về phục hồi, tăng độ dẻo dai và Pilates cải thiện vóc dáng.",
    availableTimes: [
      "Thứ 3 - 09:00", "Thứ 3 - 15:00", "Thứ 3 - 17:00",
      "Thứ 5 - 09:00", "Thứ 5 - 14:00", "Thứ 5 - 18:00",
      "Thứ 7 - 08:00", "Thứ 7 - 10:00"
    ]
  },
  {
    id: "PT003",
    name: "Phạm Minh Hải",
    avatarUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=200&auto=format&fit=crop",
    specialty: "Boxing, Kickfit, HIIT cường độ cao",
    rating: 5.0,
    price: 400000,
    bio: "Cựu vận động viên Boxing cấp tỉnh. Giáo án tập luyện cực kỳ năng động, giúp giải tỏa stress và đốt calo thần tốc.",
    availableTimes: [
      "Thứ 2 - 18:00", "Thứ 2 - 20:00",
      "Thứ 4 - 18:00", "Thứ 4 - 20:00",
      "Thứ 6 - 18:00", "Thứ 6 - 20:00",
      "Chủ Nhật - 09:00", "Chủ Nhật - 15:00"
    ]
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  // 20 Lịch sử tập trong tháng 5/2026
  {
    id: "BK-001",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Gói nâng cao",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-28",
    status: "ATTENDED" // Chưa đánh giá & Còn hạn
  },
  {
    id: "BK-002",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Gói nâng cao",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-25",
    status: "ATTENDED", // Đã đánh giá & Còn hạn
    rating: 5,
    comment: "HLV rất nhiệt tình, hướng dẫn chi tiết và đúng kỹ thuật. Buổi tập rất hiệu quả và tôi cảm thấy rất hài lòng!",
    ratedAt: "25/05/2026 • 09:25"
  },
  {
    id: "BK-003",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Gói cơ bản",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-20",
    status: "ATTENDED", // Đã đánh giá & Quá hạn
    rating: 4,
    comment: "Bài tập vừa sức, PT chuyên nghiệp và chỉnh sửa tư thế rất chu đáo.",
    ratedAt: "20/05/2026 • 09:30"
  },
  {
    id: "BK-004",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Gói cơ bản",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-18",
    status: "ATTENDED", // Đã đánh giá & Quá hạn
    rating: 4,
    comment: "PT hỗ trợ nhiệt tình trong suốt buổi tập.",
    ratedAt: "18/05/2026 • 09:15"
  },
  {
    id: "BK-005",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Không",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-15",
    status: "MISSED" // Vắng mặt
  },
  {
    id: "BK-006",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Gói cơ bản",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-12",
    status: "ATTENDED", // Đã đánh giá & Quá hạn
    rating: 4,
    comment: "Hướng dẫn tốt, tập mệt nhưng hiệu quả.",
    ratedAt: "12/05/2026 • 09:10"
  },
  {
    id: "BK-007",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Gói cơ bản",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-08",
    status: "ATTENDED", // Đã sửa & Quá hạn
    rating: 4,
    comment: "Đã cải thiện kỹ năng tập ngực dưới sự kèm cặp của PT.",
    ratedAt: "08/05/2026 • 09:05",
    isEditedRating: true
  },
  {
    id: "BK-008",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Không",
    timeSlot: "09:30 - 10:30",
    date: "2026-05-06",
    status: "MISSED" // Vắng mặt
  },
  {
    id: "BK-011",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Gói nâng cao",
    timeSlot: "09:00 - 10:00",
    date: "2026-05-27",
    status: "ATTENDED" // Chưa đánh giá & Còn hạn
  },
  {
    id: "BK-012",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Gói nâng cao",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-23",
    status: "ATTENDED", // Đã sửa & Còn hạn
    rating: 5,
    comment: "Tập mệt nhưng hiệu quả vô cùng. PT thiết kế giáo án phù hợp với sức bền của tôi.",
    ratedAt: "23/05/2026 • 09:15",
    isEditedRating: true
  },
  {
    id: "BK-013",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Gói cơ bản",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-22",
    status: "ATTENDED", // Đã đánh giá & Còn hạn
    rating: 4,
    comment: "PT hỗ trợ nhiệt tình và động viên kịp thời.",
    ratedAt: "22/05/2026 • 09:10"
  },
  {
    id: "BK-014",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Gói cơ bản",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-24",
    status: "CANCELLED" // Đã hủy
  },
  {
    id: "BK-015",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Không",
    timeSlot: "09:30 - 10:30",
    date: "2026-05-21",
    status: "MISSED" // Vắng mặt
  },
  {
    id: "BK-016",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Gói nâng cao",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-19",
    status: "ATTENDED" // Chưa đánh giá & Quá hạn
  },
  {
    id: "BK-017",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Gói cơ bản",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-17",
    status: "ATTENDED" // Chưa đánh giá & Quá hạn
  },
  {
    id: "BK-018",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Gói nâng cao",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-14",
    status: "ATTENDED", // Đã đánh giá & Quá hạn
    rating: 5,
    comment: "Buổi tập chuyên sâu cơ đùi rất hiệu quả.",
    ratedAt: "14/05/2026 • 09:10"
  },
  {
    id: "BK-019",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Gói cơ bản",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-10",
    status: "CANCELLED" // Đã hủy
  },
  {
    id: "BK-020",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Gói cơ bản",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-05",
    status: "ATTENDED" // Chưa đánh giá & Quá hạn
  },
  {
    id: "BK-021",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Gói nâng cao",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-03",
    status: "ATTENDED", // Đã đánh giá & Quá hạn
    rating: 3,
    comment: "HLV hướng dẫn hơi nhanh, cần giảm nhịp độ lại.",
    ratedAt: "03/05/2026 • 09:15"
  },
  {
    id: "BK-022",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Gói nâng cao",
    timeSlot: "08:00 - 09:00",
    date: "2026-05-02",
    status: "ATTENDED" // Chưa đánh giá & Quá hạn
  },
  // 5 Lịch sử tập trong tháng 6/2026
  {
    id: "BK-009",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Gói nâng cao",
    timeSlot: "08:00 - 09:00",
    date: "2026-06-01",
    status: "ATTENDED" // Chưa đánh giá & Còn hạn
  },
  {
    id: "BK-010",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Gói cơ bản",
    timeSlot: "09:00 - 10:00",
    date: "2026-06-05",
    status: "ATTENDED", // Đã đánh giá & Còn hạn
    rating: 5,
    comment: "Rất hài lòng với HLV Lê Thị B, bài tập chuẩn.",
    ratedAt: "05/06/2026 • 10:15"
  },
  {
    id: "BK-023",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Không",
    timeSlot: "08:00 - 09:00",
    date: "2026-06-10",
    status: "MISSED" // Vắng mặt
  },
  {
    id: "BK-024",
    userId: "M001",
    ptId: "PT002",
    ptName: "Lê Thị B",
    serviceName: "Không",
    timeSlot: "08:00 - 09:00",
    date: "2026-06-12",
    status: "CANCELLED" // Đã hủy
  },
  {
    id: "BK-025",
    userId: "M001",
    ptId: "PT001",
    ptName: "Nguyễn Văn A",
    serviceName: "Gói nâng cao",
    timeSlot: "08:00 - 09:00",
    date: "2026-06-15",
    status: "ATTENDED" // Chưa đánh giá & Còn hạn
  }
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "PM-001",
    userId: "M001",
    userName: "Nguyễn Văn An",
    amount: 1500000,
    paymentDate: "2026-05-01 10:30",
    planName: "Gói 3 Tháng",
    method: "QR Code",
    status: "SUCCESS"
  },
  {
    id: "PM-002",
    userId: "M002",
    userName: "Trần Thị Bình",
    amount: 600000,
    paymentDate: "2026-04-10 14:15",
    planName: "Gói 1 Tháng",
    method: "ATM",
    status: "SUCCESS"
  },
  {
    id: "PM-003",
    userId: "M003",
    userName: "Hoàng Đức Minh",
    amount: 5000000,
    paymentDate: "2026-05-20 09:00",
    planName: "Gói 12 Tháng",
    method: "Ví Điện Tử",
    status: "SUCCESS"
  }
];

const INITIAL_CHECKINS: CheckIn[] = [
  {
    id: "CK-001",
    userId: "M001",
    userName: "Nguyễn Văn An",
    checkInTime: "2026-06-10 07:55",
    checkOutTime: "2026-06-10 09:30"
  },
  {
    id: "CK-002",
    userId: "M003",
    userName: "Hoàng Đức Minh",
    checkInTime: "2026-06-10 17:30",
    checkOutTime: "2026-06-10 19:00"
  },
  {
    id: "CK-003",
    userId: "M001",
    userName: "Nguyễn Văn An",
    checkInTime: "2026-06-11 07:50",
    checkOutTime: null // Hiện tại đang trong phòng gym
  }
];

// Lịch làm việc mẫu của nhân viên/PT (Dạng Grid Multichoice)
// Lưu trữ dưới dạng map: { "PT001-Thứ 2-Ca Sáng": true, ... }
const INITIAL_WORK_SCHEDULE: Record<string, boolean> = {
  "PT001-Thu2-Sang": true,
  "PT001-Thu3-Sang": true,
  "PT001-Thu4-Sang": true,
  "PT001-Thu5-Chieu": true,
  "PT002-Thu3-Chieu": true,
  "PT002-Thu4-Chieu": true,
  "PT002-Thu5-Sang": true,
  "PT002-Thu6-Sang": true,
  "PT003-Thu2-Toi": true,
  "PT003-Thu4-Toi": true,
  "PT003-Thu6-Toi": true,
  "R001-Thu2-Sang": true,
  "R001-Thu3-Sang": true,
  "R001-Thu4-Sang": true,
  "R001-Thu5-Chieu": true,
  "R001-Thu6-Chieu": true,
};

// Vé ngày (Daily Passes) đang hoạt động
export interface DailyPass {
  id: string;
  buyerName: string;
  buyerPhone: string;
  price: number;
  purchasedAt: string;
  checkedInAt: string | null;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
}

const INITIAL_DAILY_PASSES: DailyPass[] = [
  {
    id: "DP-8891",
    buyerName: "Vũ Hoàng Long",
    buyerPhone: "0977665544",
    price: 80000,
    purchasedAt: "2026-06-11 08:30",
    checkedInAt: "2026-06-11 08:35",
    status: "USED"
  },
  {
    id: "DP-2301",
    buyerName: "Phạm Thu Trang",
    buyerPhone: "0988223344",
    price: 80000,
    purchasedAt: "2026-06-11 11:20",
    checkedInAt: null,
    status: "ACTIVE"
  }
];

// Helper để lấy dữ liệu từ localStorage
function getStore<T>(key: string, initial: T): T {
  if (typeof window === 'undefined') return initial;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return initial;
  }
}

function setStore<T>(key: string, data: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export const GymDB = {
  // Lấy dữ liệu
  getUsers: () => getStore<User[]>('gym_users', INITIAL_USERS),
  getMemberships: () => getStore<Membership[]>('gym_memberships', INITIAL_MEMBERSHIPS),
  getPTs: () => getStore<PT[]>('gym_pts', INITIAL_PTS),
  getBookings: () => getStore<Booking[]>('gym_bookings_v4', INITIAL_BOOKINGS),
  getPayments: () => getStore<Payment[]>('gym_payments', INITIAL_PAYMENTS),
  getCheckIns: () => getStore<CheckIn[]>('gym_checkins', INITIAL_CHECKINS),
  getDailyPasses: () => getStore<DailyPass[]>('gym_dailypasses', INITIAL_DAILY_PASSES),
  getWorkSchedule: () => getStore<Record<string, boolean>>('gym_workschedule', INITIAL_WORK_SCHEDULE),

  // Lưu dữ liệu
  setUsers: (users: User[]) => setStore('gym_users', users),
  setMemberships: (memberships: Membership[]) => setStore('gym_memberships', memberships),
  setBookings: (bookings: Booking[]) => setStore('gym_bookings_v4', bookings),
  setPayments: (payments: Payment[]) => setStore('gym_payments', payments),
  setCheckIns: (checkins: CheckIn[]) => setStore('gym_checkins', checkins),
  setDailyPasses: (passes: DailyPass[]) => setStore('gym_dailypasses', passes),
  setWorkSchedule: (schedule: Record<string, boolean>) => setStore('gym_workschedule', schedule),

  // Hàm bổ trợ nghiệp vụ
  checkInUser: (userId: string): { success: boolean; message: string; name?: string } => {
    const users = GymDB.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, message: "Không tìm thấy mã hội viên này!" };

    // Kiểm tra trạng thái membership
    const memberships = GymDB.getMemberships();
    const membership = memberships.find(m => m.userId === userId);
    if (!membership || membership.status !== 'ACTIVE') {
      return { success: false, message: `Thẻ hội viên ${user.name} đã hết hạn hoặc chưa đăng ký gói tập!`, name: user.name };
    }

    // Kiểm tra xem đã checkin mà chưa checkout chưa
    const checkins = GymDB.getCheckIns();
    const activeCheckin = checkins.find(c => c.userId === userId && c.checkOutTime === null);
    if (activeCheckin) {
      return { success: false, message: `Hội viên ${user.name} hiện đang ở trong phòng tập rồi (chưa checkout)!`, name: user.name };
    }

    const now = new Date();
    const newCheckin: CheckIn = {
      id: `CK-${Math.floor(Math.random() * 90000) + 10000}`,
      userId,
      userName: user.name,
      checkInTime: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      checkOutTime: null
    };

    GymDB.setCheckIns([newCheckin, ...checkins]);
    return { success: true, message: `Check-in thành công cho ${user.name}!`, name: user.name };
  },

  checkOutUser: (userId: string): { success: boolean; message: string; name?: string } => {
    const users = GymDB.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, message: "Không tìm thấy mã hội viên này!" };

    const checkins = GymDB.getCheckIns();
    const activeCheckinIndex = checkins.findIndex(c => c.userId === userId && c.checkOutTime === null);
    if (activeCheckinIndex === -1) {
      return { success: false, message: `Hội viên ${user.name} không ở trong phòng tập (chưa check-in)!`, name: user.name };
    }

    const now = new Date();
    const updatedCheckins = [...checkins];
    updatedCheckins[activeCheckinIndex] = {
      ...updatedCheckins[activeCheckinIndex],
      checkOutTime: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    };

    GymDB.setCheckIns(updatedCheckins);
    return { success: true, message: `Check-out thành công cho ${user.name}!`, name: user.name };
  },

  checkInDailyPass: (passId: string): { success: boolean; message: string } => {
    const passes = GymDB.getDailyPasses();
    const passIndex = passes.findIndex(p => p.id === passId);
    if (passIndex === -1) return { success: false, message: "Vé ngày không tồn tại!" };

    const pass = passes[passIndex];
    if (pass.status === 'USED') return { success: false, message: "Vé này đã được sử dụng trước đó!" };
    if (pass.status === 'EXPIRED') return { success: false, message: "Vé đã quá hạn sử dụng!" };

    const now = new Date();
    const updatedPasses = [...passes];
    updatedPasses[passIndex] = {
      ...pass,
      status: 'USED',
      checkedInAt: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    };
    GymDB.setDailyPasses(updatedPasses);
    return { success: true, message: `Check-in Vé Ngày thành công cho ${pass.buyerName}!` };
  }
};
