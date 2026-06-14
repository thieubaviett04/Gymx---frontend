"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "hoivien") {
      router.push("/");
    } else if (role === "letan") {
      router.push("/receptionist");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!phoneNumber || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ số điện thoại và mật khẩu!");
      return;
    }

    if (phoneNumber === "0123456789" && password === "hoivien123") {
      localStorage.setItem("userRole", "hoivien");
      router.push("/");
    } else if (phoneNumber === "0987654321" && password === "letan123") {
      localStorage.setItem("userRole", "letan");
      router.push("/receptionist");
    } else {
      setErrorMessage("Số điện thoại hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 bg-neutral-900 font-sans select-none"
      style={{
        backgroundImage: 'url("/gym_hero_bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background overlay matching user request */}
      <div className="absolute inset-0 bg-neutral-950/35 z-0" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl p-10 flex flex-col items-center border border-neutral-100">
        
        {/* Top Orange Circle with Angled Dumbbell Icon */}
        <div className="w-16 h-16 rounded-full bg-[#FF6B00] flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/25">
          <Dumbbell className="w-8 h-8 rotate-[45deg]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-neutral-900 tracking-wide mb-1 uppercase">
          Đăng nhập tài khoản
        </h2>
        
        {/* Subtitle */}
        <p className="text-xs font-semibold text-neutral-400 mb-8 text-center">
          Chào mừng bạn tới với hệ thống, đăng nhập để bắt đầu
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold px-4 py-3 rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col">
          {/* Phone Number Field */}
          <div className="space-y-1.5 mb-5">
            <label htmlFor="phone" className="block text-xs font-bold text-neutral-700">
              Số điện thoại
            </label>
            <input
              id="phone"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Nhập số điện thoại của bạn"
              className="w-full border border-neutral-200 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-colors placeholder:text-neutral-300 text-neutral-800 font-medium"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 mb-6">
            <label htmlFor="pass" className="block text-xs font-bold text-neutral-700">
              Mật khẩu
            </label>
            <div className="relative w-full">
              <input
                id="pass"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                className="w-full border border-neutral-200 text-sm pl-4 pr-10 py-3.5 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-colors placeholder:text-neutral-300 text-neutral-850 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-450 hover:text-neutral-600 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Checkbox and Forgot Password Link */}
          <div className="flex items-center justify-between w-full text-xs font-bold text-neutral-500 mb-8">
            <label className="flex items-center gap-2 cursor-pointer hover:text-neutral-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-[#FF6B00] focus:ring-[#FF6B00] cursor-pointer"
              />
              <span>Nhớ tài khoản</span>
            </label>
            <button
              type="button"
              onClick={() => alert("Tính năng quên mật khẩu sẽ được cập nhật sau!")}
              className="text-[#FF6B00] hover:underline cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!phoneNumber.trim() || !password.trim()}
            className={`w-full font-bold text-sm py-3.5 rounded-xl transition-all duration-300 shadow-md ${
              phoneNumber.trim() && password.trim()
                ? "bg-[#FF6B00] hover:bg-[#E56000] text-white cursor-pointer active:scale-[0.99] shadow-orange-500/15"
                : "bg-[#FDBA74] text-white/90 cursor-not-allowed opacity-80 shadow-none"
            }`}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
