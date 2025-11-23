// import { useState } from "react"
// import { Mail, Lock, User, Eye, EyeOff, Loader } from "lucide-react"

// export default function AuthPage({ onAuthSuccess }) {
//   const [isLogin, setIsLogin] = useState(true)
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState("")
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   })

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//     setError("")
//   }

//   const validateForm = () => {
//     if (!formData.email.includes("@")) {
//       setError("Please enter a valid email")
//       return false
//     }
//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters")
//       return false
//     }
//     if (!isLogin && formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match")
//       return false
//     }
//     if (!isLogin && !formData.name.trim()) {
//       setError("Please enter your name")
//       return false
//     }
//     return true
//   }

//   const handleSubmit = async () => {
//     if (!validateForm()) return

//     setLoading(true)
    
//     // Simulate API call
//     setTimeout(() => {
//       const userData = {
//         email: formData.email,
//         name: isLogin ? formData.email.split("@")[0] : formData.name,
//         id: Math.random().toString(36).substr(2, 9),
//       }
      
//       // Call the callback with user data
//       onAuthSuccess?.(userData)
//       setLoading(false)
//     }, 1000)
//   }

//   const toggleAuthMode = () => {
//     setIsLogin(!isLogin)
//     setError("")
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     })
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4">
//       {/* Animated background elements */}
//       <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

//       {/* Main card */}
//       <div className="relative w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
//           {/* Header */}
//           <div className="mb-8 text-center">
//             <div className="flex items-center justify-center mb-4">
//               <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-lg">
//                 <Package className="w-6 h-6 text-white" />
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold text-slate-900 mb-2">
//               {isLogin ? "Welcome Back" : "Join Us"}
//             </h1>
//             <p className="text-slate-600 text-sm">
//               {isLogin
//                 ? "Sign in to your delivery account"
//                 : "Create your delivery account"}
//             </p>
//           </div>

//           {/* Form Fields */}
//           <div className="space-y-4">
//             {/* Name field (signup only) */}
//             {!isLogin && (
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-slate-700">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="John Doe"
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Email field */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-slate-700">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="you@example.com"
//                   className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Password field */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-slate-700">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="••••••••"
//                   className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm password field (signup only) */}
//             {!isLogin && (
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-slate-700">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     placeholder="••••••••"
//                     className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Error message */}
//             {error && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-sm text-red-600">{error}</p>
//               </div>
//             )}

//             {/* Submit button */}
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
//             >
//               {loading && <Loader className="w-4 h-4 animate-spin" />}
//               {isLogin ? "Sign In" : "Create Account"}
//             </button>
//           </div>

//           {/* Divider */}
//           <div className="my-6 flex items-center">
//             <div className="flex-1 border-t border-slate-300"></div>
//             <span className="px-3 text-sm text-slate-500">or</span>
//             <div className="flex-1 border-t border-slate-300"></div>
//           </div>

//           {/* Toggle auth mode */}
//           <div className="text-center">
//             <p className="text-slate-600 text-sm">
//               {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//               <button
//                 onClick={toggleAuthMode}
//                 className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
//               >
//                 {isLogin ? "Sign Up" : "Sign In"}
//               </button>
//             </p>
//           </div>

//           {/* Demo info */}
//           <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
//             <p className="text-xs text-blue-700 text-center">
//               <span className="font-semibold">Demo Mode:</span> Use any email/password (min 6 chars) to continue
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// function Package(props) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       {...props}
//     >
//       <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
//       <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
//       <line x1="12" y1="22.08" x2="12" y2="12" />
//     </svg>
//   )
// }



















import { useState } from "react"
import { Mail, Lock, User, Eye, EyeOff, Loader, Phone, MapPin } from "lucide-react"

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (!isLogin && !formData.name.trim()) {
      setError("Please enter your name")
      return false
    }
    if (!isLogin && !formData.phone.trim()) {
      setError("Please enter your phone number")
      return false
    }
    if (!isLogin && !formData.address.trim()) {
      setError("Please enter your address")
      return false
    }
    if (!isLogin && !formData.city.trim()) {
      setError("Please enter your city")
      return false
    }
    if (!isLogin && !formData.pincode.trim()) {
      setError("Please enter your pincode")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        email: formData.email,
        name: isLogin ? formData.email.split("@")[0] : formData.name,
        id: Math.random().toString(36).substr(2, 9),
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.address && { address: formData.address }),
        ...(formData.city && { city: formData.city }),
        ...(formData.pincode && { pincode: formData.pincode }),
      }
      
      // Call the callback with user data
      onAuthSuccess?.(userData)
      setLoading(false)
    }, 1000)
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Main card */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? "Welcome Back" : "Join Us"}
            </h1>
            <p className="text-slate-600 text-sm">
              {isLogin
                ? "Sign in to your delivery account"
                : "Create your delivery account"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name field (signup only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password field (signup only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Contact Details Section */}
            {!isLogin && (
              <>
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Contact Details</h3>
                  
                  {/* Phone field */}
                  <div className="space-y-2 mb-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Details Section */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Address Details</h3>
                  
                  {/* Street Address */}
                  <div className="space-y-2 mb-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Street Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-2 mb-4">
                    <label className="block text-sm font-medium text-slate-700">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New Delhi"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Pincode */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Pincode
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="110001"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 mt-6"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="px-3 text-sm text-slate-500">or</span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>

          {/* Toggle auth mode */}
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={toggleAuthMode}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Demo info */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              <span className="font-semibold">Demo Mode:</span> Use any email/password (min 6 chars) to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Package(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}