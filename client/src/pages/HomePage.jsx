import { KeyRound, DoorClosedLocked, TimerReset, FileStack, ImageUp, PersonStanding } from 'lucide-react';
import { Link } from "react-router-dom"

const HomePage = () => {
    const jsxml =
        <div className="containerHome">
            <div className="mt-0 mb-5 pl-20">
                <svg width="300" height="100" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
                    {/* <!-- Puntos modulares (opcional) --> */}
                    <circle cx="12" cy="24" r="4" fill="oklch(52% 0.105 223.128)" />
                    <circle cx="12" cy="40" r="4" fill="oklch(52% 0.105 223.128)" />
                    <circle cx="12" cy="56" r="4" fill="oklch(52% 0.105 223.128)" />

                    {/* <!-- Texto principal --> */}
                    <text x="32" y="48" fontFamily="Inter, -apple-system, sans-serif"
                        fontWeight="700" fontSize="32" fill="oklch(52% 0.105 223.128)">
                        dmjDev
                    </text>

                    {/* <!-- Tagline opcional --> */}
                    <text x="92" y="62" fontFamily="Inter, -apple-system, sans-serif"
                        fontWeight="300" fontSize="12" fill="#666">
                        imagine is free
                    </text>
                </svg>
            </div>

            <div className="relative mb-5 max-w-4xl w-full">
                <div className="animated-border-box">
                    <div className="content-box">
                        <h2 className="md:text-4xl font-semibold text-center leading-tight">
                            <p>There's much more working for you</p><p>than you see</p>
                        </h2>
                    </div>
                </div>
            </div>

            <div className='text-xs text-zinc-500 pb-5 text-center px-20'>
                <p>Hardened-security base app, built for seamless component integration and infinite scalability. <Link to="/register" className='no-underline hover:underline' title='Register'>Give it a try</Link>.</p>
                <p>While it launches with a standard task management module, its plug-and-play architecture supports extending functionality with stock systems, asset managers, or scheduling tools, and everything you can imagine.</p>
            </div>

            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="feature-item-border">
                    <div className="feature-item">
                        <div className="flex flex-col items-start gap-2">
                            <div className="shrink-0">
                                <KeyRound size={36} strokeWidth={2.25} absoluteStrokeWidth style={{ color: 'oklch(52% 0.105 223.128)' }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Secure Login with Server Side Token</h3>
                                <p className="text-gray-400 text-md">
                                    Your data is protected with enterprise-grade security and server-side token authentication.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="feature-item-border">
                    <div className="feature-item">
                        <div className="flex flex-col items-start gap-2">
                            <div className="shrink-0">
                                <DoorClosedLocked size={36} strokeWidth={2.25} absoluteStrokeWidth style={{ color: 'oklch(52% 0.105 223.128)' }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Access protected granted</h3>
                                <p className="text-gray-400 text-md">
                                    Rate limiting for failed login attempts, account lockout, and secure automated user account unlocking.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="feature-item-border">
                    <div className="feature-item">
                        <div className="flex flex-col items-start gap-2">
                            <div className="shrink-0">
                                <TimerReset size={36} strokeWidth={2.25} absoluteStrokeWidth style={{ color: 'oklch(52% 0.105 223.128)' }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">TTL session timer protection</h3>
                                <p className="text-gray-400 text-md">
                                    User token lifetime limits with inactivity-based feedback.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="feature-item-border">
                    <div className="feature-item">
                        <div className="flex flex-col items-start gap-2">
                            <div className="shrink-0">
                                <FileStack size={36} strokeWidth={2.25} absoluteStrokeWidth style={{ color: 'oklch(52% 0.105 223.128)' }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Securing every layer of your application.</h3>
                                <p className="text-gray-400 text-md">
                                    Per-endpoint route protection via middleware-enforced security policies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="feature-item-border">
                    <div className="feature-item">
                        <div className="flex flex-col items-start gap-2">
                            <div className="shrink-0">
                                <ImageUp size={36} strokeWidth={2.25} absoluteStrokeWidth style={{ color: 'oklch(52% 0.105 223.128)' }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Securing every image updated.</h3>
                                <p className="text-gray-400 text-md">
                                    Secure image handling using binary Blob storage systems.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="feature-item-border">
                    <div className="feature-item">
                        <div className="flex flex-col items-start gap-2">
                            <div className="shrink-0">
                                <PersonStanding size={36} strokeWidth={2.25} absoluteStrokeWidth style={{ color: 'oklch(52% 0.105 223.128)' }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2"><p>Intuitive & accessible</p><p>UI/UX.</p></h3>
                                <p className="text-gray-400 text-md">
                                    High availability ensuring WCAG AA compliance and a seamless experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='text-xs text-zinc-500 py-4 m-0'>
                All rights reserved 2026&copy;Copyright to dmj.develop@gmail.com
            </div>
        </div>

    return jsxml
}

export default HomePage
