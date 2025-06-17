"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingButton, FloatingButtonItem } from "@/components/ui/floating-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { KeyRound, Loader2, LogIn, Mail, MessageCircleQuestion } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export function Index() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { profile, loading: profileLoading } = useProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const success = await login(email, password);
            if (!success) {
                toast({
                    title: "Login Failed",
                    description: "Invalid email or password.",
                    variant: "destructive",
                });
            }
            // Navigation is now handled in AuthContext
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Error",
                description: "An error occurred during login.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const items = [
        {
            icon: <Mail />,
            bgColor: 'bg-orange-500',
            href: 'mailto:helpdesk@hakaauto.co.id'
        },
        {
            icon: <FaWhatsapp />,
            bgColor: 'bg-green-500',
            href: 'https://wa.me/+62895392525133?text=Hello%20Bumi%20Auto%20Helpdesk'
        },
    ];

    return (
        <div className="lg:py-6">
            <div className="dmsans-regular relative mx-auto flex max-w-7xl flex-col items-center justify-center rounded-xl p-4 lg:p-10">
                <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80 rounded-xl">
                    <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
                </div>
                <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80 rounded-xl">
                    <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80 rounded-xl">
                    <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                </div>
                <div className="flex flex-col justify-center items-center px-4 py-2 sm:py-8">
                    <img src="/assets/logo-bumi.png" alt="Logo Bumi Auto" className="w-60 text-center" />
                    <h1 className="relative z-10 mx-auto w-full text-center text-2xl font-bold text-indigo-600 md:text-4xl lg:text-6xl dark:text-slate-300">
                        {"Bumi Auto Helpdesk System"
                            .split(" ")
                            .map((word, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.1,
                                        ease: "easeInOut",
                                    }}
                                    className="mr-2 inline-block"
                                >
                                    {word}
                                </motion.span>
                            ))}
                    </h1>
                </div>

                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.3,
                        delay: 1,
                    }}
                    className="w-full z-10 lg:mt-8 flex flex-wrap items-center justify-center gap-4"
                >
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <KeyRound className="h-8 w-8 text-blue-600" />
                                <CardTitle className="text-2xl text-blue-600">Helpdesk Login</CardTitle>
                            </div>
                            <p className="text-gray-600">
                                Sign in to access the ticketing system
                            </p>
                        </CardHeader>
                        <CardContent className="gap-2 flex flex-col items-center w-full">
                            <form onSubmit={handleSubmit} className="w-full space-y-4 flex items-center flex-col gap-2">
                                <div className="space-y-2 w-full">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2 w-full">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="w-full flex flex-col gap-2">
                                    <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="h-4 w-4 mr-2" />
                                                Sign In
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                            <a href="/FAQ" className="w-full">
                                <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all">
                                    <>
                                        <MessageCircleQuestion className="h-6 w-6 mr-2" />
                                        FAQ
                                    </>
                                </Button>
                            </a>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            <FloatingButton
                triggerContent={
                    <button className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 dark:bg-slate-800 text-white/80 z-50">
                        <IoCallOutline />
                    </button>
                }
                className="fixed"
            >
                {items.map((item, key) => (
                    <FloatingButtonItem key={key}>
                        <a href={item.href} target="_blank" rel="noopener noreferrer">
                            <button
                                className={cn(
                                    'h-12 w-12 text-2xl rounded-full flex items-center justify-center text-white/80',
                                    item.bgColor
                                )}>
                                {item.icon}
                            </button>
                        </a>
                    </FloatingButtonItem>
                ))}
            </FloatingButton>
        </div>
    );
}