export default function PolaroidCard({ photoSrc, name, message, cardRef }) {
    return (
        <div ref={cardRef} className="polaroid">
            {photoSrc ? (
                /* Wrapper div constrains height; image uses contain so no cropping */
                <div className="polaroid-photo-frame">
                    <img src={photoSrc} alt={name} className="polaroid-photo" crossOrigin="anonymous" />
                </div>
            ) : (
                <div className="polaroid-photo-placeholder">🌸</div>
            )}
            <div className="polaroid-caption">
                <h3>{name || 'Beautiful'}</h3>
                <p>{message}</p>
            </div>
        </div>
    )
}
