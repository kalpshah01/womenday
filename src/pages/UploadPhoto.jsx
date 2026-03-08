import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UploadPhoto() {
    const navigate = useNavigate()
    const [preview, setPreview] = useState(null)
    const [dragging, setDragging] = useState(false)
    const inputRef = useRef()

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = (e) => {
            const base64 = e.target.result
            localStorage.setItem('wd_photo', base64)
            setPreview(base64)
            // Navigate after short delay so user sees the preview
            setTimeout(() => navigate('/card'), 900)
        }
        reader.readAsDataURL(file)
    }

    const onInputChange = (e) => handleFile(e.target.files[0])

    const onDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    return (
        <div className="page" style={{ zIndex: 1 }}>
            <div className="glass-card">
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>📸</div>
                <h1 className="display">Upload your photo</h1>
                <p className="body-text mb-2" style={{ marginBottom: '1.5rem' }}>
                    Take a selfie or choose a photo — it'll appear on your greeting card 💖
                </p>

                <div
                    className={`upload-area ${dragging ? 'drag-over' : ''}`}
                    onClick={() => inputRef.current.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    id="upload-area"
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="preview-img" />
                    ) : (
                        <>
                            <div className="upload-icon">🖼️</div>
                            <span>Click or drag & drop your photo here</span>
                            <span style={{ fontSize: '0.85rem', color: '#c9a0bc', marginTop: '0.3rem' }}>
                                Supports JPG, PNG, WEBP
                            </span>
                        </>
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    style={{ display: 'none' }}
                    onChange={onInputChange}
                    id="file-input"
                />

                {preview && (
                    <p style={{ color: 'var(--purple)', fontWeight: 700, fontSize: '0.95rem' }}>
                        ✅ Photo saved! Taking you to your card…
                    </p>
                )}
            </div>
        </div>
    )
}
