import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ScanLine, Camera, CameraOff,
    CheckCircle, AlertTriangle, XCircle,
    User, Package, ArrowLeft, RotateCcw
} from 'lucide-react';
import AdminNavBar from '../components/utils/AdminNavBar';
import api from '../Api';

/* ─────────────────────────────────────────────
   QR Scanner — uses the lower-level Html5Qrcode
   class for full lifecycle control (no Scanner UI)
───────────────────────────────────────────── */
export default function AdminQRScanPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);    // camera / init errors
    const [apiError, setApiError] = useState(null);      // API call errors
    const [loading, setLoading] = useState(false);

    // A single Html5Qrcode instance that lives for the life of this component
    const qrRef = useRef(null);
    // Prevent calling setState after the component unmounts
    const mountedRef = useRef(true);

    /* ── Profile ── */
    useEffect(() => {
        mountedRef.current = true;
        api.get('/api/profile/').then(r => {
            if (mountedRef.current) setProfile(r.data);
        }).catch(() => {});
        api.get('/api/notifications/').then(r => {
            if (mountedRef.current) setNotifications(r.data?.results || r.data || []);
        }).catch(() => {});
        return () => { mountedRef.current = false; };
    }, []);

    /* ── Cleanup on unmount ── */
    useEffect(() => {
        return () => {
            const qr = qrRef.current;
            if (qr) {
                if (qr.isScanning) {
                    qr.stop().catch(() => {}).finally(() => qr.clear().catch(() => {}));
                } else {
                    qr.clear().catch(() => {});
                }
                qrRef.current = null;
            }
        };
    }, []);

    /* ── handleScan — called once a QR is detected ── */
    const handleScan = useCallback(async (decodedText) => {
        if (loading || !mountedRef.current) return;
        if (mountedRef.current) {
            setLoading(true);
            setScanResult(null);
            setApiError(null);
        }

        try {
            const res = await api.post('/api/admin/qr/scan/', { qr_code: decodedText });
            if (mountedRef.current) setScanResult(res.data);
        } catch (err) {
            if (mountedRef.current) setApiError(err.response?.data?.error || 'Failed to process QR code.');
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [loading]);

    /* ── startScanner ── */
    const startScanner = useCallback(async () => {
        if (!mountedRef.current) return;
        setScanError(null);
        setScanResult(null);
        setApiError(null);

        try {
            // Reuse existing instance or create a fresh one
            if (!qrRef.current) {
                qrRef.current = new Html5Qrcode('qr-viewport', true); // Enable verbose logging
            }

            const qr = qrRef.current;

            // If for any reason it's mid-scan, stop first
            if (qr.isScanning) {
                await qr.stop().catch(() => {});
            }

            await qr.start(
                { facingMode: 'environment' },        // rear camera on mobile
                { 
                    fps: 10, // Lower FPS reduces CPU strain and improves success rate
                    qrbox: (viewPortWidth, viewPortHeight) => {
                        return {
                            width: viewPortWidth * 0.7, // Take up 70% of the width
                            height: viewPortWidth * 0.7 
                        };
                    },
                    aspectRatio: 1.0 // Force a square aspect ratio to match the UI
                },
                (decodedText) => {
                    // Stop immediately so we don't double-fire
                    qr.stop().catch(() => {});
                    if (mountedRef.current) setScanning(false);
                    handleScan(decodedText);
                },
                () => { /* no QR in frame — keep scanning silently */ }
            );

            if (mountedRef.current) setScanning(true);

        } catch (err) {
            if (!mountedRef.current) return;
            const msg = err?.message || String(err);
            if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
                setScanError('Camera permission denied. Please allow camera access in your browser settings and try again.');
            } else if (msg.includes('NotFoundError')) {
                setScanError('No camera found on this device.');
            } else if (msg.includes('AbortError')) {
                // Swallow — this is a React Strict-Mode double-mount artefact
            } else {
                setScanError('Could not start camera. ' + msg);
            }
            if (mountedRef.current) setScanning(false);
        }
    }, [handleScan]);

    /* ── stopScanner ── */
    const stopScanner = useCallback(async () => {
        const qr = qrRef.current;
        if (qr && qr.isScanning) {
            await qr.stop().catch(() => {});
        }
        if (mountedRef.current) setScanning(false);
    }, []);

    /* ── scanAgain ── */
    const scanAgain = useCallback(() => {
        setScanResult(null);
        setApiError(null);
        setScanError(null);
        startScanner();
    }, [startScanner]);

    /* ── Status config ── */
    const getStatusConfig = (status) => {
        if (status === 'success') return {
            Icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50',
            border: 'border-emerald-200', iconColor: 'text-emerald-500', label: 'Verified & Collected',
        };
        if (status === 'already_scanned') return {
            Icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50',
            border: 'border-amber-200', iconColor: 'text-amber-500', label: 'Already Scanned',
        };
        return {
            Icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50',
            border: 'border-rose-200', iconColor: 'text-rose-500', label: 'Error',
        };
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <AdminNavBar profile={profile} notifications={notifications} onOpenNotifications={() => {}} />

            <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
                {/* Back */}
                <button
                    onClick={() => navigate('/admin-dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="bg-indigo-600 p-2.5 rounded-xl shadow-md shadow-indigo-500/20">
                            <ScanLine className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">QR Scanner</h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-14 text-sm">
                        Scan a student's QR code to verify and mark their order as collected.
                    </p>
                </header>

                {/* Camera card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-6"
                >
                    {/* Viewport — html5-qrcode renders the video INSIDE this div */}
                    <div className="relative bg-slate-900 min-h-[320px] flex items-center justify-center">
                        <div id="qr-viewport" className="w-full min-h-[300px]" />

                        {/* Placeholder when camera is off */}
                        {!scanning && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
                                <div className="w-20 h-20 bg-slate-800/80 rounded-3xl flex items-center justify-center">
                                    <Camera className="text-slate-400 w-10 h-10" />
                                </div>
                                <p className="text-slate-400 font-medium text-sm px-6 text-center max-w-xs">
                                    Press <strong>Start Scanner</strong> to open the camera
                                </p>
                            </div>
                        )}

                        {/* Visual Guide Overlay */}
                        {scanning && (
                            <div className="absolute inset-0 border-[60px] border-black/40 pointer-events-none z-10 flex items-center justify-center">
                                <div className="w-full h-full max-w-[250px] max-h-[250px] border-2 border-indigo-500 rounded-lg shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                            </div>
                        )}

                        {/* Live indicator */}
                        {scanning && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-2 pointer-events-none z-20">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-white text-xs font-bold uppercase tracking-wider">Live — point at QR code</span>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="p-6 flex justify-center gap-3">
                        {scanning ? (
                            <button
                                onClick={stopScanner}
                                className="flex items-center gap-2 px-7 py-3.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all active:scale-95"
                            >
                                <CameraOff size={19} /> Stop Scanner
                            </button>
                        ) : (
                            <button
                                onClick={startScanner}
                                disabled={loading}
                                className="flex items-center gap-2 px-7 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50"
                            >
                                <Camera size={19} />
                                {scanResult || apiError ? 'Scan Again' : 'Start Scanner'}
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Camera / init error */}
                <AnimatePresence>
                    {scanError && (
                        <motion.div
                            key="scan-error"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4 mb-6"
                        >
                            <XCircle className="text-rose-400 w-5 h-5 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold text-rose-700 text-sm">Camera Error</p>
                                <p className="text-rose-600 text-sm mt-0.5">{scanError}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-white border border-slate-100 rounded-2xl p-8 flex flex-col items-center gap-4 mb-6"
                        >
                            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-slate-500 font-bold text-sm">Verifying QR code…</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* API error */}
                <AnimatePresence>
                    {apiError && !loading && (
                        <motion.div
                            key="api-error"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-rose-50 border border-rose-200 rounded-2xl p-8 flex flex-col items-center gap-4 mb-6 text-center"
                        >
                            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center">
                                <XCircle className="text-rose-500 w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-rose-800">Invalid QR Code</h3>
                            <p className="text-rose-600 text-sm">{apiError}</p>
                            <button onClick={scanAgain} className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all active:scale-95">
                                <RotateCcw size={15} /> Try Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scan result */}
                <AnimatePresence>
                    {scanResult && !loading && (() => {
                        const cfg = getStatusConfig(scanResult.status);
                        const { Icon } = cfg;
                        return (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                                className={`${cfg.bg} border ${cfg.border} rounded-[2rem] overflow-hidden`}
                            >
                                {/* Status banner */}
                                <div className="p-6 flex items-center gap-4 border-b border-white/40">
                                    <div className={`w-12 h-12 ${cfg.bg} border ${cfg.border} rounded-2xl flex items-center justify-center`}>
                                        <Icon className={`${cfg.iconColor} w-6 h-6`} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-base ${cfg.color}`}>{cfg.label}</h3>
                                        <p className="text-slate-600 text-sm font-medium">{scanResult.message}</p>
                                    </div>
                                </div>

                                {/* Student */}
                                {scanResult.student && (
                                    <div className="p-6 bg-white/50 border-b border-white/40 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{scanResult.student.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {scanResult.student.roll_no} · {scanResult.student.email}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Items */}
                                {scanResult.items?.length > 0 && (
                                    <div className="p-6 bg-white/30">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Package className="w-4 h-4 text-slate-400" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Items</span>
                                        </div>
                                        <div className="space-y-2">
                                            {scanResult.items.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-100">
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{item.item_name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            Qty {item.quantity}{item.hall ? ` · ${item.hall}` : ''}
                                                        </p>
                                                    </div>
                                                    <span className="font-bold text-slate-800">₹{item.cost?.toFixed(0)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {scanResult.total_cost != null && (
                                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/60">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
                                                <span className="text-xl font-black text-slate-900">₹{scanResult.total_cost?.toFixed(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Scan next */}
                                <div className="p-5 bg-white/20 flex justify-center">
                                    <button
                                        onClick={scanAgain}
                                        className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                                    >
                                        <RotateCcw size={15} /> Scan Next
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>
            </main>
        </div>
    );
}
