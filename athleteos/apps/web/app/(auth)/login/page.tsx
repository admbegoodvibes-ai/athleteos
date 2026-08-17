'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, LogIn, Eye, EyeOff, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      
      if (error) throw error
      
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Falha ao fazer login. Verifique suas credenciais.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-card/50 border border-border/50 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <LogIn size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Bem-vindo de volta</h1>
            <p className="text-muted-foreground text-sm mt-2 text-center">
              Acesse sua conta para continuar gerenciando sua carreira no futebol.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-9 bg-background/50 border-border/50 focus:border-emerald-500/50 transition-colors"
                  {...form.register('email')}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="/forgot-password" className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-9 pr-9 bg-background/50 border-border/50 focus:border-emerald-500/50 transition-colors"
                  {...form.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-11 rounded-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Link href="/register" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
              Cadastre-se
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacidade</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
