"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { travelApi } from "../../services/api";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = isLogin
        ? await travelApi.login(username, password)
        : await travelApi.signup(username, password);

      if (data.access_token) {
        login(data.access_token, data.username);
        router.push("/"); // Redirect to home after success
      }
    } catch (err) {
      alert("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {isLogin ? "Enter WanderPlan" : "Create Account"}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-sm text-blue-600 hover:underline w-full text-center"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
