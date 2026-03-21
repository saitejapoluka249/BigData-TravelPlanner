"use client";
import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { travelApi } from "../../services/api";
import { useRouter } from "next/navigation";
import { Upload, User } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // New profile fields for signup
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let data;

      if (isLogin) {
        // Standard login
        data = await travelApi.login(username, password);
      } else {
        // Signup with profile fields
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        if (fullName) formData.append("full_name", fullName);
        if (email) formData.append("email", email);
        if (mobile) formData.append("mobile_number", mobile);
        if (profilePic) formData.append("profile_picture", profilePic);

        data = await travelApi.signup(formData);
      }

      if (data.access_token) {
        login(data.access_token, data.username);
        router.push("/"); // Redirect to home after success
      }
    } catch (err) {
      alert("Authentication failed. Please check your credentials.");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset fields on toggle
    setFullName("");
    setEmail("");
    setMobile("");
    setProfilePic(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture Upload - Only visible during Signup */}
          {!isLogin && (
            <div className="flex flex-col items-center gap-2 mb-4">
              <div
                className="w-20 h-20 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-slate-400" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={16} className="text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <span className="text-xs text-slate-500">
                Upload Profile Picture (Optional)
              </span>
            </div>
          )}

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username *"
              required
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Full Name (Optional)"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Mobile Number (Optional)"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </>
            )}

            <input
              type="password"
              placeholder="Password *"
              required
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-2">
            {isLogin ? "Enter WanderPlan" : "Create Account"}
          </button>
        </form>

        <button
          onClick={toggleMode}
          className="mt-6 text-sm text-blue-600 hover:underline w-full text-center"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
