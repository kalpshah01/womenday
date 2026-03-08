const STAR_LABELS = ['😞 Poor', '😕 Fair', '😊 Good', '😄 Great', '🤩 Amazing']

export default function StarRating({ rating, onChange }) {
    return (
        <div>
            <div className="stars-row">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className={`star-btn ${rating >= star ? 'active' : ''}`}
                        onClick={() => onChange(star)}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        title={STAR_LABELS[star - 1]}
                    >
                        {rating >= star ? '⭐' : '☆'}
                    </button>
                ))}
            </div>
            {rating > 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-mid)', fontSize: '0.9rem' }}>
                    {STAR_LABELS[rating - 1]}
                </p>
            )}
        </div>
    )
}
