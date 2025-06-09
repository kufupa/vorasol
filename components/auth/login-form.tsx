"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"
import Image from "next/image"

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    // Basic validation
    if (username === "admin" && password === "password") {
      // In a real app, you'd set a session/token here
      router.push("/dashboard")
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <Image
          src="/placeholder.svg?width=100&height=40"
          alt="EasyLease Logo"
          width={100}
          height={40}
          className="mx-auto mb-4"
        />
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>Enter your credentials to access the EasyLease HRMS dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground">
        <p>Use username: admin, password: password</p>
      </CardFooter>
    </Card>
  )
}
