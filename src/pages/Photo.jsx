import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Photo() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const name = state?.name || 'Beautiful'

    const [mode, setMode] = useState(null) // 'upload' | 'selfie'
    const [preview, setPreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [streamActive, setStreamActive] = useState(false)

    const fileInputRef = useRef()
    const videoRef = useRef()
    const canvasRef = useRef()
    const streamRef = useRef(null)

    /* ── Start camera ── */
    const startSelfie = async () => {
        setMode('selfie')
        setError('')
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.play()
                setStreamActive(true)
            }
        } catch {
            setError('❌ Camera permission denied. Please allow camera access.')
        }
    }

    /* ── Take snapshot from video ── */
    const captureSelfie = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d').drawImage(video, 0, 0)
        canvas.toBlob(blob => {
            if (!blob) return
            stopStream()
            const file = new File([blob], `selfie-${Date.now()}.png`, { type: 'image/png' })
            processFile(file)
        }, 'image/png')
    }

    const stopStream = () => {
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        setStreamActive(false)
    }

    /* ── Handle file from input ── */
    const onFileChange = (e) => {
        const file = e.target.files[0]
        if (file) processFile(file)
    }

    /* ── Convert to preview + upload ── */
    const processFile = (file) => {
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
        uploadToSupabase(file)
    }

    /* ── Upload to Supabase Storage, then insert row ── */
    const uploadToSupabase = async (file) => {
        setUploading(true)
        setError('')
        try {
            const ext = file.type === 'image/png' ? 'png' : 'jpg'
            const filePath = `photos/photo-${Date.now()}.${ext}`

            // 1. Upload file to Storage bucket "photos"
            const { error: upErr } = await supabase.storage
                .from('photos')
                .upload(filePath, file, { upsert: false, contentType: file.type })
            if (upErr) throw upErr

            // 2. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('photos')
                .getPublicUrl(filePath)

            // 3. Insert row into submissions
            const { data, error: insertErr } = await supabase
                .from('submissions')
                .insert([{ name, photo_url: publicUrl }])
                .select()
                .single()
            if (insertErr) throw insertErr

            // 4. Navigate to card page, passing data forward
            navigate('/card', {
                state: { name, photoUrl: publicUrl, submissionId: data.id },
            })
        } catch (err) {
            console.error('Upload error:', err)
            setError(`❌ Upload failed: ${err.message}. Check your Supabase credentials in .env`)
            setUploading(false)
        }
    }

    return (
        <div className="page" style={{ zIndex: 1 }}>
            <div className="glass-card">
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>📸</div>
                <h1 className="display">Add your photo</h1>
                <p className="body-text" style={{ marginBottom: '1.5rem' }}>
                    It'll appear on your personal greeting card 💖
                </p>

                {/* Mode selector */}
                {!mode && (
                    <div className="gap-row" style={{ marginTop: 0 }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => { setMode('upload'); fileInputRef.current.click() }}
                            id="upload-btn"
                        >
                            📁 Upload Photo
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={startSelfie}
                            id="selfie-btn"
                        >
                            🤳 Take Selfie
                        </button>
                    </div>
                )}

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={onFileChange}
                    id="file-input"
                />

                {/* Selfie camera */}
                {mode === 'selfie' && streamActive && (
                    <div style={{ textAlign: 'center' }}>
                        <video
                            ref={videoRef}
                            style={{ width: '100%', borderRadius: 12, maxHeight: 280, objectFit: 'cover' }}
                            autoPlay
                            playsInline
                            muted
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <div className="gap-row">
                            <button className="btn btn-primary" onClick={captureSelfie} id="capture-btn">
                                📷 Capture
                            </button>
                            <button className="btn btn-secondary" onClick={() => { stopStream(); setMode(null) }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                {mode === 'selfie' && !streamActive && !preview && (
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                )}

                {/* Preview */}
                {preview && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: 240,
                                borderRadius: 12,
                                objectFit: 'contain',
                                background: '#fdf0f7',
                            }}
                        />
                    </div>
                )}

                {/* Status */}
                {uploading && (
                    <p style={{ marginTop: '1rem', color: 'var(--purple)', fontWeight: 700 }}>
                        ⏳ Uploading to your card…
                    </p>
                )}
                {error && (
                    <p style={{ marginTop: '1rem', color: '#e53935', fontWeight: 600, fontSize: '0.88rem' }}>
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}
