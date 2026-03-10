import html2canvas from 'html2canvas';

/**
 * Captures a DOM element as a PNG and triggers download.
 * @param {HTMLElement} element - The element to capture
 * @param {string} filename - Download filename (without extension)
 */
export const downloadElementAsPng = async (element, filename = 'card') => {
    try {
        const canvas = await html2canvas(element, {
            scale: 2,             // 2x for crisp high-res output
            useCORS: true,        // allow cross-origin images
            allowTaint: true,
            backgroundColor: null,
            logging: false,
        });
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${filename}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (err) {
        console.error('Download failed:', err);
    }
};
