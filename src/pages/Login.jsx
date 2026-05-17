import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Package, Loader2 } from 'lucide-react'
import { useAuth } from '@/store/AuthContext'
import toast from 'react-hot-toast'

const schema = z.object({
  email:    z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export default function Login() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const [showPwd, setShowPwd] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data) {
    try {
      await signIn(data.email, data.password)
      toast.success('¡Bienvenido!')
      navigate('/dashboard')
    } catch {
      toast.error('Correo o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-4 shadow-lg shadow-primary-500/25">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">StockGT</h1>
          <p className="text-gray-400 text-sm mt-1">Sistema de Inventario</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="text-lg font-semibold text-white mb-1">Iniciar sesión</h2>
          <p className="text-gray-400 text-sm mb-6">Accede a tu inventario</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Correo electrónico</label>
              <input
                {...register('email')}
                type="email"
                placeholder="correo@tuempresa.com"
                className="input-field"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-2.5">
              {isSubmitting
                ? <><Loader2 size={16} className="animate-spin" /> Ingresando...</>
                : 'Ingresar al sistema'
              }
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-6">
            ¿Olvidaste tu contraseña? Contacta al administrador.
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          StockGT v1.0 · Hecho en Guatemala 🇬🇹
        </p>
      </div>
    </div>
  )
}
